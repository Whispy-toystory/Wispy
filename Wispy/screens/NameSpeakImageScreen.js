// NameSpeakScreen.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  PixelRatio,
  Animated,
  Pressable,
  TouchableOpacity,
  Alert,
  AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system'; // 오디오 파일을 읽기 위해 필요
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'; // Azure Speech SDK

// Azure Speech Service 설정 (실제 값으로 변경해주세요)
const AZURE_SPEECH_KEY = "DU6AaeXF94LbbTX22P0ZlXfdVi9a2cqaujZjpeIuiGeOIXIrELrtJQQJ99BEACYeBjFXJ3w3AAAYACOG9zJe"; // 🚨 실제 Azure Speech Key로 변경하세요!
const AZURE_SPEECH_REGION = "eastus"; // 🚨 실제 Azure Speech Region으로 변경하세요! (예: "koreacentral", "eastus")

// normalize function
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scaleFactor = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const guardianimg = require('../assets/images/angelguardian.png');
const talkingFlowerImg = require('../assets/images/talking_flower.png');

const MAX_CALLS = 5;
const RECORDING_COOLDOWN_MS = 500;

function NameSpeakScreen({ navigation }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const appState = useRef(AppState.currentState);
  const pressInActiveRef = useRef(false);
  const lastRecordingEndTimeRef = useRef(0);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isUiLocked, setIsUiLocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null);

  const [guardianName, setGuardianName] = useState(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [currentAttemptText, setCurrentAttemptText] = useState('');
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [callCount, setCallCount] = useState(0);

  const [feedbackText, setFeedbackText] = useState(
    "This is a magical talking flower! \nIf you whisper to it, your special friend will hear your words" // 영어로 유지
  );
  const [mainInstructionText, setMainInstructionText] = useState(
    "Wow! Almost ready!\nNow tell the talking flower\nyour guardian angel's name!" // 영어로 유지
  );

  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting recording permissions via AudioModule on mount...");
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission Denied', 'Permission to access microphone was denied. Please enable it in app settings to use this feature.');
          console.warn('Microphone permission denied via AudioModule on mount.');
          setHasPermission(false);
        } else {
          console.log('Microphone permission granted via AudioModule on mount.');
          setHasPermission(true);
        }
      } catch (err) {
          console.error("Error requesting recording permissions on mount:", err);
          Alert.alert('Permission Error', 'Could not request microphone permission. Please try again later.');
          setHasPermission(false);
      }
    })();
  }, []);

  const resetUiAndStopRecording = async (feedbackMsg = "Press and hold the flower, then say the name.") => {
    console.log("resetUiAndStopRecording called. Feedback:", feedbackMsg);
    pressInActiveRef.current = false;
    if (audioRecorder.isRecording) {
      console.log("resetUiAndStopRecording: audioRecorder is recording, attempting to stop.");
      try {
        await audioRecorder.stop();
      } catch (e) {
        console.warn("resetUiAndStopRecording: Error stopping audioRecorder:", e.message);
      }
    }
    setRecordedURI(null);
    setIsUiLocked(false);
    setFeedbackText(feedbackMsg);
    setShowConfirmationPrompt(false);
    lastRecordingEndTimeRef.current = Date.now();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isUiLocked || audioRecorder.isRecording) {
          await resetUiAndStopRecording("Welcome back! Press and hold to try again.");
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (audioRecorder.isRecording) {
        audioRecorder.stop().catch(e => console.warn("Error stopping recording on unmount:", e.message));
      }
    };
  }, [isUiLocked, audioRecorder.isRecording]);

  useEffect(() => {
    if (nameConfirmed && guardianName) {
      if (callCount === 0) {
        setMainInstructionText(`Great! ${guardianName} is your angel!\nNow call ${guardianName}'s name\n${MAX_CALLS} times to the flower!`);
        if (!isUiLocked) setFeedbackText(`Press and hold the flower to call ${guardianName}. (0/${MAX_CALLS})`);
      } else if (callCount > 0 && callCount < MAX_CALLS) {
        setMainInstructionText(`Keep going!\nCall ${guardianName}'s name\n${MAX_CALLS - callCount} more times!`);
         if (!isUiLocked) setFeedbackText(`${guardianName} heard you! (${callCount}/${MAX_CALLS}) Call again!`);
      } else if (callCount === MAX_CALLS) {
        setMainInstructionText(`Amazing!\nYou've called ${guardianName}'s name ${MAX_CALLS} times!`);
        if (!isUiLocked) setFeedbackText(`${guardianName} is waking up!`);
      }
    } else if (!nameConfirmed) {
        setMainInstructionText("Wow! Almost ready!\nNow tell the talking flower\nyour guardian angel's name!");
        if (!isUiLocked && !showConfirmationPrompt) {
             setFeedbackText("Press and hold the flower, then say the name.");
        }
    }
  }, [nameConfirmed, guardianName, callCount, isUiLocked, showConfirmationPrompt]);


  async function startRecording() {
    if (!pressInActiveRef.current) {
        await resetUiAndStopRecording();
        return;
    }
    setIsUiLocked(true);
    setFeedbackText('Listening...');
    setShowConfirmationPrompt(false);
    try {
      await audioRecorder.prepareToRecordAsync();
      if (!pressInActiveRef.current) {
          await resetUiAndStopRecording();
          return;
      }
      await audioRecorder.record();
      if (!audioRecorder.isRecording) {
          throw new Error("AudioRecorder failed to start recording.");
      }
    } catch (err) {
      console.error('Failed to start recording session:', err);
      await resetUiAndStopRecording('Could not start listening. Please try again.');
    }
  }

  // Azure Speech API를 사용하여 음성 인식 수행
  const recognizeSpeechWithAzure = async (audioUri) => {
    if (!audioUri) {
      console.warn("Azure STT: Received null or undefined URI.");
      return "Error: No audio URI provided.";
    }
    if (!AZURE_SPEECH_KEY || AZURE_SPEECH_KEY === "YOUR_AZURE_SPEECH_KEY" || !AZURE_SPEECH_REGION || AZURE_SPEECH_REGION === "YOUR_AZURE_SPEECH_REGION") {
        Alert.alert("Azure API Error", "Azure Speech API Key or Region is not configured.");
        return "Error: Azure API not configured.";
    }

    console.log(`Azure STT: Recognizing speech from URI: ${audioUri}`);
    setFeedbackText('Processing your voice...');

    try {
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(AZURE_SPEECH_KEY, AZURE_SPEECH_REGION);
      speechConfig.speechRecognitionLanguage = "en-US";

      // expo-audio가 생성하는 오디오 파일 (m4a)을 Azure SDK가 직접 처리할 수 있도록 PushAudioInputStream 사용
      // 1. 파일을 ArrayBuffer로 읽기
      const audioFile = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const audioBuffer = Uint8Array.from(atob(audioFile), c => c.charCodeAt(0)).buffer;

      // 2. PushAudioInputStream 생성 및 설정
      const pushStream = SpeechSDK.AudioInputStream.createPushStream(SpeechSDK.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1)); // 기본 PCM 포맷, 실제 녹음 설정과 맞출 필요
      pushStream.write(audioBuffer);
      pushStream.close(); // 모든 데이터 작성 후 스트림 닫기

      const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
      
      // 이전 fromWavFileInput 방식 주석 처리
      // const audioConfig = SpeechSDK.AudioConfig.fromWavFileInput(audioUri);

      const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      return new Promise((resolve, reject) => {
        recognizer.recognizeOnceAsync(
          result => {
            let recognizedText = "";
            if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
              recognizedText = result.text;
              console.log(`Azure STT: Recognized: ${recognizedText}`);
            } else if (result.reason === SpeechSDK.ResultReason.NoMatch) {
              console.log("Azure STT: NOMATCH: Speech could not be recognized.");
              recognizedText = "";
            } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
              const cancellation = SpeechSDK.CancellationDetails.fromResult(result);
              console.log(`Azure STT: CANCELED: Reason=${cancellation.reason}`);
              if (cancellation.reason === SpeechSDK.CancellationReason.Error) {
                console.error(`Azure STT: CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                console.error(`Azure STT: CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                // 추가적인 오류 정보 확인 (예: 인증 실패, 연결 문제 등)
                if (cancellation.errorDetails.includes("1006") || cancellation.errorDetails.includes("Connection failed")) {
                    Alert.alert("Azure STT Error", "Connection to Azure Speech Service failed. Please check your network and API key/region.");
                } else if (cancellation.errorDetails.includes("Unable to contact server")) {
                     Alert.alert("Azure STT Error", "Unable to contact Azure server. Check network or Azure service status.");
                }
              }
              recognizedText = "Error: Recognition canceled.";
            }
            recognizer.close();
            resolve(recognizedText);
          },
          err => {
            console.error(`Azure STT: recognizeOnceAsync error: ${err}`);
            recognizer.close();
            reject(`Error: STT failed - ${err}`);
          }
        );
      });

    } catch (error) {
      console.error("Azure STT: Error in recognizeSpeechWithAzure:", error);
      return `Error: STT process failed - ${error.message}`;
    }
  };


  async function stopRecording() {
    console.log("stopRecording: Called. audioRecorder.isRecording:", audioRecorder.isRecording);
    pressInActiveRef.current = false;

    if (!audioRecorder.isRecording) {
      if(isUiLocked) await resetUiAndStopRecording();
      return;
    }

    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (!uri) {
          console.error("stopRecording: Failed to get URI after stopping.");
          setFeedbackText('Recording failed to save. Please try again.');
      } else {
        setRecordedURI(uri);
        console.log('Recording stopped. URI:', uri);

        const recognizedName = await recognizeSpeechWithAzure(uri);

        if (!nameConfirmed) {
            setCurrentAttemptText(recognizedName);
            if (recognizedName && recognizedName.trim() !== "" && !recognizedName.startsWith("Error:")) {
                setFeedbackText(`Did you say: "${recognizedName}"?`);
                setShowConfirmationPrompt(true);
            } else {
                 setFeedbackText(recognizedName.startsWith("Error:") ? recognizedName : "I didn't catch a name. Press and hold to try again.");
                 setShowConfirmationPrompt(false);
            }
        } else if (callCount < MAX_CALLS) {
            if (recognizedName && recognizedName.trim() !== "" && !recognizedName.startsWith("Error:") && recognizedName.toLowerCase().includes(guardianName?.toLowerCase() || '###')) {
                setCallCount(prevCount => prevCount + 1);
            } else if (recognizedName && !recognizedName.startsWith("Error:")) {
                setFeedbackText(`I heard "${recognizedName}", but please call for ${guardianName}!`);
            }
             else {
                setFeedbackText(recognizedName.startsWith("Error:") ? recognizedName : `I didn't catch that call clearly for ${guardianName}. Try calling again!`);
            }
        }
      }
    } catch (error) {
      console.error('Failed to stop or process recording:', error);
      setFeedbackText('Oops! Something went wrong. Please try again.');
      setShowConfirmationPrompt(false);
    } finally {
      setIsUiLocked(false);
      lastRecordingEndTimeRef.current = Date.now();
    }
  }

  const handleNameConfirmation = (isCorrect) => {
    setShowConfirmationPrompt(false);
    if (isCorrect) {
      setGuardianName(currentAttemptText);
      setNameConfirmed(true);
      setCallCount(0);
    } else {
      setFeedbackText('Okay, let\'s try that again. Press and hold the flower to say the name.');
      setCurrentAttemptText('');
    }
    setIsUiLocked(false);
    lastRecordingEndTimeRef.current = Date.now();
  };

  const onPressInFlower = async () => {
    const now = Date.now();
    if (now - lastRecordingEndTimeRef.current < RECORDING_COOLDOWN_MS) return;
    if (isUiLocked || audioRecorder.isRecording) return;
    if (callCount === MAX_CALLS && nameConfirmed) {
        setFeedbackText(`${guardianName} is already waking up!`);
        return;
    }

    pressInActiveRef.current = true;
    Animated.spring(scaleValue, { toValue: 0.85, useNativeDriver: true, friction: 4, tension: 60 }).start();

    if (!hasPermission) {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if(!status.granted) {
            Alert.alert("Permission Denied", "Microphone permission is required. Please enable it in app settings.");
            pressInActiveRef.current = false;
            Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
            setFeedbackText("Microphone permission needed.");
            return;
        }
        setHasPermission(true);
    }
    await startRecording();
  };

  const onPressOutFlower = async () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
    const wasPressActive = pressInActiveRef.current;
    pressInActiveRef.current = false;

    if (callCount === MAX_CALLS && nameConfirmed) return;

    if (audioRecorder.isRecording || (wasPressActive && isUiLocked)) {
        await stopRecording();
    } else {
        if (isUiLocked && feedbackText === 'Listening...') {
            await resetUiAndStopRecording();
        }
    }
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <SubAppLogo />
        </View>

        <View style={styles.instructionTextContainer}>
          <Text style={styles.mainText}>
            {mainInstructionText}
          </Text>
        </View>

        <View style={styles.characterImageContainer}>
          <Wisker source={guardianimg} style ={{
            shadowColor: '#00ff00',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 20,
          }}/>
        </View>

        <View style={styles.interactiveFlowerArea}>
          <View style={styles.speechBubbleWrapper}>
            <View style={styles.speechBubbleContent}>
              <Text style={styles.speechBubbleText}>
                {feedbackText}
              </Text>
            </View>
            <View style={styles.speechBubblePointer} />
          </View>

          {showConfirmationPrompt && !isUiLocked && (
            <View style={styles.confirmationContainer}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.yesButton]}
                onPress={() => handleNameConfirmation(true)}
              >
                <Text style={styles.confirmationButtonText}>Yes!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.noButton]}
                onPress={() => handleNameConfirmation(false)}
              >
                <Text style={styles.confirmationButtonText}>No, Say Again</Text>
              </TouchableOpacity>
            </View>
          )}

          <Pressable
            onPressIn={onPressInFlower}
            onPressOut={onPressOutFlower}
            disabled={(callCount === MAX_CALLS && nameConfirmed) || isUiLocked }
            style={styles.flowerTouchable}
          >
            <Animated.View style={[{ transform: [{ scale: scaleValue }] }, isUiLocked && styles.recordingFlower ]}>
              <Image source={talkingFlowerImg} style={styles.flowerImageStyle} />
            </Animated.View>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// 스타일 정의는 이전과 동일하게 유지
const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1 },
  headerContainer: {
    flex: 0.1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: normalize(15),
    paddingTop: Platform.OS === 'android' ? normalize(20) : normalize(10),
  },
  instructionTextContainer: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(18),
    lineHeight: normalize(28),
    fontFamily: Fonts.suitHeavy,
  },
  characterImageContainer: {
    flex: 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: normalize(10),
  },
  interactiveFlowerArea: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: normalize(20),
  },
  speechBubbleWrapper: {
    alignItems: 'center',
    marginBottom: normalize(10),
    minHeight: normalize(60)
  },
  speechBubbleContent: {
    backgroundColor: Colors.wispyButtonYellow,
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(12),
    borderRadius: normalize(15),
    maxWidth: '90%',
  },
  speechBubbleText: {
    textAlign: 'center',
    color: Colors.wispyTextBlue,
    fontSize: normalize(14),
    fontFamily: Fonts.suitHeavy,
    lineHeight: normalize(18),
  },
  speechBubblePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(10),
    borderRightWidth: normalize(10),
    borderTopWidth: normalize(15),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.wispyButtonYellow,
    alignSelf: 'center',
  },
  confirmationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '85%',
    marginTop: normalize(5),
    marginBottom: normalize(10),
  },
  confirmationButton: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(15),
    borderRadius: normalize(20),
    minWidth: normalize(110),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  yesButton: {
    backgroundColor: Colors.wispyGreen || '#4CAF50'
  },
  noButton: {
    backgroundColor: Colors.wispyRed || '#F44336'
  },
  confirmationButtonText: {
    color: Colors.wispyWhite || '#FFFFFF',
    fontFamily: Fonts.suitBold || Fonts.suitHeavy,
    fontSize: normalize(14),
  },
  flowerTouchable: {},
  flowerImageStyle: {
    width: normalize(130),
    height: normalize(130)
  },
  recordingFlower: {
    opacity: 0.7
  }
});

export default NameSpeakScreen;
