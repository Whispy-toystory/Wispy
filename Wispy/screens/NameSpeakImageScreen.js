// NameSpeakImageScreen.js
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
import { useNavigation } from '@react-navigation/native';
import { Audio, InterruptionModeAndroid } from 'expo-av';

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

const mockRecognizeSpeechFromUri = async (uri) => {
  console.log(`Mock STT: Simulating speech recognition for URI: ${uri}`);
  if (!uri) {
    console.warn("Mock STT: Received null or undefined URI.");
    return "Error in STT (no URI)";
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const names = ["Luna", "Sol", "Stella", "Aria", "Bella", "Kai"];
      resolve(names[Math.floor(Math.random() * names.length)]);
    }, 1000);
  });
};

function NameSpeakImageScreen({ navigation }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const appState = useRef(AppState.currentState);
  const pressInActiveRef = useRef(false); 
  const lastRecordingEndTimeRef = useRef(0);

  // expo-audio의 useAudioRecorder 대신 expo-av의 recording 객체를 state로 관리합니다.
  const [recording, setRecording] = useState(null);
  const [isUiLocked, setIsUiLocked] = useState(false); 
  const [hasPermission, setHasPermission] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null); 

  const [guardianName, setGuardianName] = useState(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [currentAttemptText, setCurrentAttemptText] = useState('');
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [callCount, setCallCount] = useState(0);

  const [feedbackText, setFeedbackText] = useState(
    "This is a magical talking flower! \nIf you whisper to it, your special friend will hear your words"
  );
  const [mainInstructionText, setMainInstructionText] = useState(
    "Wow! Almost ready!\nNow tell the talking flower\nyour guardian angel's name!"
  );

  useEffect(() => {
    (async () => {
      try {
        console.log("Requesting recording permissions via expo-av on mount...");
        // AudioModule 대신 Audio.requestPermissionsAsync() 사용
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access microphone was denied. Please enable it in app settings to use this feature.');
          console.warn('Microphone permission denied via expo-av on mount.');
          setHasPermission(false);
        } else {
          console.log('Microphone permission granted via expo-av on mount.');
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
    if (recording) {
      console.log("resetUiAndStopRecording: recording object exists, attempting to stop.");
      try {
        await recording.stopAndUnloadAsync();
        console.log("resetUiAndStopRecording: recording.stopAndUnloadAsync() successful.");
      } catch (e) {
        console.warn("resetUiAndStopRecording: Error stopping recording:", e);
      }
      setRecording(null);
    } else {
      console.log("resetUiAndStopRecording: no active recording.");
    }
    setRecordedURI(null); 
    setIsUiLocked(false); 
    setFeedbackText(feedbackMsg);
    setShowConfirmationPrompt(false);
    lastRecordingEndTimeRef.current = Date.now();
  };
  
  // AppState 변경 시 녹음 중지 로직 수정
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      console.log(`AppState changed from ${appState.current} to ${nextAppState}`);
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        if (isUiLocked || recording) { 
          console.log('App re-activated, resetting UI and stopping any active recording.');
          await resetUiAndStopRecording("Welcome back! Press and hold to try again.");
        }
      }
      appState.current = nextAppState;
    });
  
    return () => {
      subscription.remove();
       if (recording && !recording._isDoneRecording) { // _isDoneRecording은 내부 상태이므로, 다른 방법도 고려 가능
        console.log("Component unmounting, stopping recording (cleanup).");
        recording.stopAndUnloadAsync().catch(e => {
          // 이미 언로드된 경우 발생하는 경고는 무시합니다.
          if (!e.message.includes("Cannot unload a Recording that has already been unloaded.")) {
            console.warn("Error stopping recording on unmount:", e);
          }
        });
      }
    };
  }, [isUiLocked, recording]);

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

  useEffect(() => {
    // 이름이 확정되고, 호출 횟수가 최대치에 도달했을 때만 실행
    if (nameConfirmed && callCount === MAX_CALLS) {
      console.log('Call count reached max. Setting 3-second timer for navigation...');
      
      // 2초 후에 다음 화면으로 넘어가는 타이머 설정
      const timer = setTimeout(() => {
        navigation.navigate('PlayStart');
      }, 2000);

      // 컴포넌트가 언마운트되거나 useEffect가 다시 실행되기 전에 타이머를 정리합니다.(메모리 누수 방지)
      return () => {
        console.log('Clearing navigation timer.');
        clearTimeout(timer);
      };
    }
  }, [nameConfirmed, callCount, navigation]);

  async function startRecording() {
    console.log("startRecording: Attempting. pressInActiveRef:", pressInActiveRef.current);
    if (!pressInActiveRef.current) { 
        console.log("startRecording: Press no longer active. Aborting.");
        await resetUiAndStopRecording(); 
        return;
    }
    
    setIsUiLocked(true); 
    setFeedbackText('Listening...');
    setShowConfirmationPrompt(false);

    try {
      // 오디오 세션 설정이 안정적인 녹음에 매우 중요합니다.
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      console.log("startRecording: Creating new recording instance...");
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording); // 새로 생성된 recording 객체를 state에 저장
      console.log('Recording started successfully with expo-av.');

    } catch (err) {
      console.error('Failed to start recording session:', err);
      await resetUiAndStopRecording('Could not start listening. Please try again.');
    }
  }

  async function stopRecording() {
    console.log("stopRecording: Called. recording object:", recording ? "exists" : "null");
    pressInActiveRef.current = false; 

    if (!recording) {
      console.log("stopRecording: no active recording. Resetting UI if it was locked.");
      if(isUiLocked) await resetUiAndStopRecording(); 
      return;
    }
    
    setFeedbackText('Got it! Thinking...'); 
    try {
      console.log("stopRecording: Calling stopAndUnloadAsync()...");
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); 
      
      if (!uri) {
          console.error("stopRecording: Failed to get URI after stopping. Recording might not have saved.");
          setFeedbackText('Recording failed to save. Please try again.');
      } else {
        setRecordedURI(uri);
        console.log('Recording stopped. URI:', uri);
        const recognizedName = await mockRecognizeSpeechFromUri(uri);

        if (!nameConfirmed) {
            setCurrentAttemptText(recognizedName);
            if (recognizedName && recognizedName.trim() !== "" && recognizedName !== "Error in STT (no URI)") {
                setFeedbackText(`Did you say: "${recognizedName}"?`);
                setShowConfirmationPrompt(true);
            } else {
                 setFeedbackText("I didn't catch a name. Press and hold to try again.");
                 setShowConfirmationPrompt(false);
            }
        } else if (callCount < MAX_CALLS) {
            if (recognizedName && recognizedName.trim() !== "" && recognizedName !== "Error in STT (no URI)"){
                setCallCount(prevCount => prevCount + 1);
            } else {
                setFeedbackText(`I didn't catch that call clearly for ${guardianName}. Try calling again!`);
            }
        }
      }
    } catch (error) {
      console.error('Failed to stop or process recording:', error);
      setFeedbackText('Oops! Something went wrong. Please try again.');
      setShowConfirmationPrompt(false);
    } finally {
      console.log("stopRecording: finally block. Resetting UI lock.");
      setRecording(null); // 녹음 객체 초기화
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
    console.log("onPressInFlower: Triggered. isUiLocked:", isUiLocked);

    const now = Date.now();
    if (now - lastRecordingEndTimeRef.current < RECORDING_COOLDOWN_MS) {
        console.log("onPressInFlower: In cooldown period. Ignoring.");
        return;
    }

    if (isUiLocked || recording) { 
        console.warn("onPressInFlower: Already locked or recording. Ignoring.");
        return;
    }
    if (callCount === MAX_CALLS && nameConfirmed) {
        setFeedbackText(`${guardianName} is already waking up!`);
        return;
    }

    pressInActiveRef.current = true; 
    Animated.spring(scaleValue, { toValue: 0.85, useNativeDriver: true, friction: 4, tension: 60 }).start();
    
    if (!hasPermission) {
        console.log("onPressInFlower: Permission not granted. Requesting again...");
        const { status } = await Audio.requestPermissionsAsync();
        if(status !== 'granted') {
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
    console.log("onPressOutFlower: Triggered. pressInActiveRef was:", pressInActiveRef.current, "recording:", recording ? "exists" : "null", "isUiLocked:", isUiLocked);
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
    const wasPressActive = pressInActiveRef.current;
    pressInActiveRef.current = false; 

    if (callCount === MAX_CALLS && nameConfirmed) return;

    if (recording || (wasPressActive && isUiLocked)) { 
        await stopRecording();
    } else { 
        console.log("onPressOutFlower: No active recording to stop or UI was not in a recording-intended state. Resetting if UI was 'Listening...'.");
        if (isUiLocked && feedbackText === 'Listening...') { 
            await resetUiAndStopRecording(); 
        }
    }
  };

  // 나머지 UI 코드는 동일합니다.
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
    shadowColor: Colors.wispyBlack,
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 1.41, 
    elevation: 2,
  },
  yesButton: { 
    backgroundColor: Colors.wispyGreen 
  },
  noButton: { 
    backgroundColor: Colors.wispyRed 
  },
  confirmationButtonText: {
    color: Colors.wispyWhite, 
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

export default NameSpeakImageScreen;
