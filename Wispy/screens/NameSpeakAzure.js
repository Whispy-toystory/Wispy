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
// expo-audio의 useAudioRecorder와 AudioModule을 사용합니다.
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';
// 녹음된 오디오 재생을 위해 expo-av의 Audio를 사용합니다.
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64';

// Azure Speech Service 설정 (환경 변수 사용 권장)
// 중요: 실제 프로덕션 환경에서는 키를 하드코딩하지 마세요. 환경 변수를 사용하세요.
const AZURE_SPEECH_KEY = process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.EXPO_PUBLIC_AZURE_SPEECH_REGION;

// normalize 함수
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

// RecordingPresets.HIGH_QUALITY는 .m4a를 생성하므로,
// Audio.Recording 클래스를 직접 사용하고 RecordingPresets.HIGH_QUALITY를 전달합니다.
// 이 프리셋은 Android에서 AAC 인코딩된 .m4a를 생성합니다.

function NameSpeakScreen({ navigation }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const appState = useRef(AppState.currentState);
  const pressInActiveRef = useRef(false);
  const lastRecordingEndTimeRef = useRef(0);

  // Audio.Recording 인스턴스를 직접 관리합니다.
  const [currentRecording, setCurrentRecording] = useState(null); // useAudioRecorder 대신 직접 관리
  // 녹음 상태를 UI에 반영하기 위한 새로운 상태
  const [isAudioRecordingActive, setIsAudioRecordingActive] = useState(false);
  console.log("초기 currentRecording 인스턴스:", currentRecording);
  console.log("설정에서 가져온 Azure Speech Key:", AZURE_SPEECH_KEY);
  console.log("설정에서 가져온 Azure Speech Region:", AZURE_SPEECH_REGION);

  // 재생을 위한 Audio.Sound 인스턴스 상태
  const [sound, setSound] = useState(null);
  const [hasRecordingToPlay, setHasRecordingToPlay] = useState(false);


  const [isUiLocked, setIsUiLocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [recordedURI, setRecordedURI] = useState(null);

  const [guardianName, setGuardianName] = useState(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [currentAttemptText, setCurrentAttemptText] = useState('');
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [callCount, setCallCount] = useState(0);

  // UI 콘텐츠는 영어로 유지
  const [feedbackText, setFeedbackText] = useState(
    "This is a magical talking flower! \nIf you whisper to it, your special friend will hear your words"
  );
  const [mainInstructionText, setMainInstructionText] = useState(
    "Wow! Almost ready!\nNow tell the talking flower\nyour guardian angel's name!"
  );

  useEffect(() => {
    (async () => {
      try {
        console.log("AudioModule을 통한 마운트 시 녹음 권한 요청 중...");
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission Denied', 'Microphone access permission was denied. Please enable it in app settings to use this feature.');
          console.warn('마운트 시 마이크 권한 거부됨.');
          setHasPermission(false);
        } else {
          console.log('마운트 시 마이크 권한 승인됨.');
          setHasPermission(true);
        }
      } catch (err) {
        console.error("마운트 시 녹음 권한 요청 중 오류:", err);
        Alert.alert('Permission Error', 'Could not request microphone permission. Please try again later.');
        setHasPermission(false);
      }
    })();
  }, []);

  const resetUiAndStopRecording = async (feedbackMsg = "Press and hold the flower, then say the name.") => {
    console.log("resetUiAndStopRecording 호출됨. 피드백:", feedbackMsg);
    pressInActiveRef.current = false;

    // currentRecording 인스턴스가 유효하고 녹음 중인지 확인
    if (currentRecording) {
      try {
        const status = await currentRecording.getStatusAsync();
        if (status.isRecording) {
            console.log("resetUiAndStopRecording: currentRecording이 녹음 중이므로 중지를 시도합니다.");
            await currentRecording.stopAndUnloadAsync(); // stopAndUnloadAsync 사용
            console.log("resetUiAndStopRecording: currentRecording.stopAndUnloadAsync() 성공.");
        } else if (status.isLoaded) {
            // 녹음 중이 아니지만 로드되어 있다면 언로드
            console.log("resetUiAndStopRecording: currentRecording이 로드되어 있지만 녹음 중이 아님. 언로드 시도.");
            await currentRecording.unloadAsync();
        }
      } catch (e) {
        console.warn("resetUiAndStopRecording: currentRecording 중지/언로드 중 오류:", e.message);
      } finally {
        setCurrentRecording(null); // 항상 currentRecording 인스턴스 초기화
      }
    } else {
      console.log("resetUiAndStopRecording: currentRecording이 유효하지 않습니다. 중지 건너뜀.");
    }
    setRecordedURI(null); // 이전에 저장된 URI를 항상 초기화
    setHasRecordingToPlay(false); // 재생 가능 상태 초기화
    setIsUiLocked(false);
    setIsAudioRecordingActive(false); // 녹음 상태 비활성화
    setFeedbackText(feedbackMsg);
    setShowConfirmationPrompt(false);
    lastRecordingEndTimeRef.current = Date.now();
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      console.log(`앱 상태 변경: ${appState.current} -> ${nextAppState}`);
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('앱이 포그라운드로 돌아왔습니다!');
        // currentRecording의 유효성을 확인한 후 isRecording에 접근
        if (isUiLocked || (currentRecording && (await currentRecording.getStatusAsync()).isRecording)) {
          console.log('앱 재활성화, UI 리셋 및 활성 녹음 중지.');
          await resetUiAndStopRecording("Welcome back! Press and hold to try again.");
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      // 언마운트 시 stop 호출 전 currentRecording의 유효성을 더 견고하게 확인
      if (currentRecording) {
        (async () => {
          try {
            const status = await currentRecording.getStatusAsync();
            if (status.isRecording) {
              console.log("컴포넌트 언마운트 중, 녹음 중지 및 언로드.");
              await currentRecording.stopAndUnloadAsync();
            } else if (status.isLoaded) {
              // 녹음은 안 하지만 로드되어 있다면 언로드
              console.log("컴포넌트 언마운트 중, 로드된 녹음 언로드.");
              await currentRecording.unloadAsync();
            }
          } catch (e) {
            console.warn("언마운트 시 녹음 중지/언로드 중 오류:", e.message);
          } finally {
            // 언마운트 시에도 currentRecording 인스턴스를 null로 설정하여 참조 해제
            setCurrentRecording(null);
            setIsAudioRecordingActive(false); // 언마운트 시 녹음 상태 비활성화
          }
        })();
      }
      // 컴포넌트 언마운트 시 재생 중인 사운드 언로드
      if (sound) {
        console.log("컴포넌트 언마운트 중, 사운드 언로드.");
        sound.unloadAsync().catch(e => console.warn("언마운트 시 사운드 언로드 중 오류:", e.message));
      }
    };
  }, [isUiLocked, currentRecording, sound]); // currentRecording, sound를 의존성 배열에 추가

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
    console.log("startRecording 호출됨. pressInActiveRef:", pressInActiveRef.current);
    if (!pressInActiveRef.current) {
        console.log("startRecording: 버튼 누름 상태 아님. 중단.");
        setIsUiLocked(false); // UI 잠금 상태 해제
        return;
    }

    setIsUiLocked(true);
    setFeedbackText('Listening...');
    setShowConfirmationPrompt(false);
    try {
      // 재생 중인 사운드가 있다면 중지 및 언로드
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }

      // 새 Audio.Recording 인스턴스 생성 및 설정
      const newRecording = new Audio.Recording();
      console.log("startRecording: new Audio.Recording() 인스턴스 생성.");
      
      console.log("startRecording: newRecording.prepareToRecordAsync() 호출 시도...");
      // RecordingPresets.HIGH_QUALITY를 사용하여 .m4a (AAC)로 녹음합니다.
      // KEY CHANGE: Android extension을 .m4a로 명시적으로 설정하여 오류 해결
      await newRecording.prepareToRecordAsync({
        android: {
          extension: '.m4a', // .wav 대신 .m4a로 변경
          outputFormat: AudioModule.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: AudioModule.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitsPerSample: 16,
        },
        ios: {
          extension: '.m4a', // iOS도 .m4a로 변경 (CAF도 가능하지만 일관성을 위해)
          audioQuality: AudioModule.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitsPerSample: 16,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      });
      console.log("startRecording: newRecording.prepareToRecordAsync() 성공.");

      if (!pressInActiveRef.current) {
          console.log("startRecording: 사용자가 prepareToRecordAsync 중 손을 뗌. 녹음 중단.");
          await resetUiAndStopRecording();
          return;
      }

      console.log("startRecording: newRecording.startAsync() 호출 시도...");
      await newRecording.startAsync();
      setCurrentRecording(newRecording); // 새로 생성된 recording 인스턴스를 상태에 저장
      setIsAudioRecordingActive(true); // 녹음 시작 시 상태 활성화
      console.log('녹음 실제 시작됨. currentRecording.getURI():', newRecording.getURI());
      console.log('녹음 실제 시작됨. (await newRecording.getStatusAsync()).isRecording:', (await newRecording.getStatusAsync()).isRecording);
      
      // isRecording 상태는 getStatusAsync()를 통해 확인하는 것이 더 정확합니다.
      if (!(await newRecording.getStatusAsync()).isRecording) {
          console.warn("newRecording.startAsync()가 완료되었지만 isRecording이 false입니다. 문제가 있을 수 있습니다.");
          await resetUiAndStopRecording('Failed to start recording. Please try again.'); // 시작 실패 시 명시적 리셋 추가
      }
    } catch (err) {
      console.error('녹음 세션 시작 실패 (prepareToRecordAsync 또는 startAsync 에서 오류):', err);
      console.error('전체 오류 객체:', JSON.stringify(err, Object.getOwnPropertyNames(err)));
      let errorMessage = 'Could not start listening. Please try again.';
      if (err.message && err.message.includes("Cannot use shared object that was already released")) {
        errorMessage = 'Audio recorder error. Please restart the app.';
      }
      await resetUiAndStopRecording(errorMessage);
    }
  }

  // Azure Speech REST API를 사용하여 음성 인식 수행
  async function recognizeSpeechWithAzureRestApi(audioFileUri) {
    if (!audioFileUri) {
      console.warn("Azure REST STT: 오디오 파일 URI가 없습니다.");
      return "Error: No audio URI provided.";
    }
    // process.env.EXPO_PUBLIC_AZURE_SPEECH_KEY 등의 환경 변수 확인으로 변경
    if (!AZURE_SPEECH_KEY || AZURE_SPEECH_KEY === "YOUR_AZURE_SPEECH_KEY_PLACEHOLDER" || !AZURE_SPEECH_REGION || AZURE_SPEECH_REGION === "YOUR_AZURE_SPEECH_REGION_PLACEHOLDER") {
      Alert.alert("Azure API Error", "Azure Speech API Key or Region is not configured. Please check your .env file and rebuild the app.");
      console.error("Azure API 키/지역이 설정되지 않았거나 플레이스홀더를 사용 중입니다. 키:", AZURE_SPEECH_KEY, "지역:", AZURE_SPEECH_REGION);
      return "Error: Azure API not configured.";
    }

    // 언어 설정 (이 부분은 사용자가 말하는 언어에 맞춰야 합니다)
    const language = "ko-KR"; // 한국어 설정
    // Azure REST STT 엔드포인트
    const endpoint = `https://${AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}&format=detailed`;

    console.log(`Azure REST STT: '${audioFileUri}'의 음성 인식 중...`);
    setFeedbackText('Processing your voice...');

    try {
      const fileInfo = await FileSystem.getInfoAsync(audioFileUri);
      if (!fileInfo.exists || fileInfo.isDirectory) {
        console.error("Azure REST STT: 오디오 파일을 찾을 수 없거나 디렉토리입니다:", audioFileUri);
        Alert.alert("File Error", "Audio file not found or is a directory. Please try recording again.");
        return "Error: Audio file not found or is a directory.";
      }
      if (fileInfo.size === 0) {
        console.error("Azure REST STT: 오디오 파일이 비어있습니다:", audioFileUri);
        Alert.alert("File Error", "Recorded audio file is empty. Please try recording again.");
        return "Error: Audio file is empty.";
      }


      // KEY CHANGE: .m4a 파일 형식에 맞게 Content-Type을 audio/mpeg로 변경
      let contentType = 'audio/mpeg'; // .m4a (AAC) 파일 형식에 맞게 변경
      console.log("선택된 Content-Type:", contentType);
      console.log("Azure Endpoint:", endpoint);

      const audioBase64 = await FileSystem.readAsStringAsync(audioFileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryString = atob(audioBase64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
          'Content-Type': contentType, // 변경된 Content-Type 적용
          'Accept': 'application/json;text/xml',
        },
        body: bytes.buffer,
      });

      const responseText = await response.text();
      console.log("Azure REST API 원본 응답 텍스트:", responseText);

      if (!response.ok) {
        console.error(`Azure REST STT HTTP Error: ${response.status} - ${responseText}`);
        let userMessage = `Error: HTTP ${response.status}.`;
        if (response.status === 401 || response.status === 403) {
          userMessage += " Please check your Azure Speech API key and region.";
        } else if (response.status === 400) {
          userMessage += " There might be an issue with the audio format or request.";
        }
        Alert.alert("Azure Error", userMessage);
        return userMessage;
      }

      const responseJson = JSON.parse(responseText);
      console.log("Azure REST API 파싱된 JSON 응답:", responseJson);

      if (responseJson.RecognitionStatus === "Success") {
        return responseJson.DisplayText || "";
      } else if (responseJson.RecognitionStatus === "NoMatch") {
        console.warn("Azure STT: NoMatch. Speech could not be recognized. Response:", responseJson);
        return ""; // No speech could be recognized
      } else {
        console.error("Azure REST STT Recognition Error:", responseJson.RecognitionStatus, responseJson);
        Alert.alert("Recognition Error", `Azure could not recognize speech: ${responseJson.RecognitionStatus}. Please try again.`);
        return `Error: ${responseJson.RecognitionStatus}`;
      }
    } catch (error) {
      console.error("Azure REST STT processing exception:", error);
      if (error.message && error.message.toLowerCase().includes("network request failed")) {
        Alert.alert("Network Error", "Could not connect to Azure Speech Service. Please check your internet connection and ensure the Azure region is correct.");
        return "Error: Network request failed.";
      }
      Alert.alert("Processing Error", `An error occurred during speech processing: ${error.message}`);
      return `Error: STT request failed - ${error.message}`;
    }
  }


  async function stopRecording() {
    // currentRecording 객체가 유효하고 녹음 중인지 확인
    const isCurrentlyRecording = currentRecording && (await currentRecording.getStatusAsync()).isRecording;
    console.log("stopRecording 호출됨. isCurrentlyRecording:", isCurrentlyRecording);
    pressInActiveRef.current = false;

    if (!currentRecording || !isCurrentlyRecording) {
      console.log("stopRecording: currentRecording이 녹음 중이 아니거나 유효하지 않습니다. UI가 잠겨있었다면 리셋.");
      if (isUiLocked) await resetUiAndStopRecording();
      return;
    }

    // KEY CHANGE: currentRecording.stopAndUnloadAsync() 호출 전에 URI를 가져옵니다.
    const uriToProcess = currentRecording.getURI(); // Audio.Recording의 getURI() 사용
    console.log('녹음 중지 전 currentRecording.getURI() 확인:', uriToProcess);

    try {
      console.log("stopRecording: currentRecording.stopAndUnloadAsync() 호출 중...");
      await currentRecording.stopAndUnloadAsync(); // 이 호출은 네이티브 리소스를 해제합니다.
      console.log("stopRecording: currentRecording.stopAndUnloadAsync() 성공.");
      
      // stopAndUnloadAsync 호출 후에는 currentRecording 인스턴스를 null로 설정하여 참조 해제
      setCurrentRecording(null); 
      setIsAudioRecordingActive(false); // 녹음 중지 시 상태 비활성화

      if (!uriToProcess || typeof uriToProcess !== 'string' || !uriToProcess.startsWith('file://')) { // URI 유효성 검사 추가
        console.error("stopRecording: 유효한 URI 가져오기 실패. 녹음이 저장되지 않았을 수 있음. URI:", uriToProcess);
        setFeedbackText('Recording failed to save or URI is invalid. Please try again.');
        setRecordedURI(null);
        setHasRecordingToPlay(false); // 재생 불가
      } else {
        setRecordedURI(uriToProcess);
        setHasRecordingToPlay(true); // 재생 가능
        // REST API 함수 호출
        const recognizedName = await recognizeSpeechWithAzureRestApi(uriToProcess); // REST API 버전 사용

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
            // 더 견고한 조건으로 업데이트
            if (recognizedName && recognizedName.trim() !== "" && !recognizedName.startsWith("Error:") && guardianName && recognizedName.toLowerCase().includes(guardianName.toLowerCase())) {
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
      console.error('녹음 중지 또는 처리 실패:', error);
      let feedback = 'Oops! Something went wrong. Please try again.';
      if (error.message && (error.message.includes("stop failed") || error.message.includes("No recording in progress"))) {
        feedback = 'Oops! Recording stop encountered an issue. Please try again.';
      } else if (error.message && error.message.includes("Cannot use shared object that was already released")){
        feedback = 'Audio system error. Please try restarting the app.';
      }
      setFeedbackText(feedback);
      setShowConfirmationPrompt(false);
      setRecordedURI(null); // 오류 발생 시 URI 초기화
      setHasRecordingToPlay(false); // 재생 불가
      setCurrentRecording(null); // 오류 발생 시에도 currentRecording 인스턴스 초기화
      setIsAudioRecordingActive(false); // 오류 발생 시 녹음 상태 비활성화
    } finally {
      console.log("stopRecording: finally 블록. UI 잠금 리셋.");
      setIsUiLocked(false);
      lastRecordingEndTimeRef.current = Date.now();
    }
  }

  // 녹음된 오디오를 재생하는 함수
  async function playSound() {
    if (!recordedURI) {
      console.warn("재생할 URI가 없습니다.");
      return;
    }
    if (sound) {
      // 이미 사운드가 로드되어 있다면 언로드
      await sound.unloadAsync();
      setSound(null);
    }
    try {
      console.log('사운드 재생 시도 중. URI:', recordedURI);
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: recordedURI },
        { shouldPlay: true }
      );
      setSound(newSound);
      await newSound.playAsync();
      console.log('사운드 재생 시작됨.');
    } catch (error) {
      console.error('사운드 재생 실패:', error);
      Alert.alert('Playback Error', 'Could not play the recorded audio. It might be corrupted or in an unsupported format for playback.');
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
    lastRecordingEndTimeRef.current = Date.now(); // Date.now()로 수정
  };

  const onPressInFlower = async () => { // async 추가
    const now = Date.now();
    if (now - lastRecordingEndTimeRef.current < RECORDING_COOLDOWN_MS) return;
    // currentRecording 객체가 null이 아니고, 녹음 중인지 확인
    if (isUiLocked || isAudioRecordingActive) return; // isAudioRecordingActive 사용
    if (callCount === MAX_CALLS && nameConfirmed) {
        setFeedbackText(`${guardianName} is already waking up!`);
        return;
    }

    pressInActiveRef.current = true;
    Animated.spring(scaleValue, { toValue: 0.85, useNativeDriver: true, friction: 4, tension: 60 }).start();

    if (!hasPermission) {
        const status = await AudioModule.requestRecordingPermissionsAsync(); // AudioModule 사용
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

  const onPressOutFlower = async () => { // async 추가
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
    const wasPressActive = pressInActiveRef.current;
    pressInActiveRef.current = false;

    if (callCount === MAX_CALLS && nameConfirmed) return;

    // currentRecording 객체가 유효하고 녹음 중인지 확인
    if (isAudioRecordingActive || (wasPressActive && isUiLocked)) { // isAudioRecordingActive 사용
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
            // disabled 상태는 isAudioRecordingActive 상태를 직접 확인
            disabled={(callCount === MAX_CALLS && nameConfirmed) || isUiLocked || isAudioRecordingActive}
            style={styles.flowerTouchable}
          >
            <Animated.View style={[{ transform: [{ scale: scaleValue }] }, isUiLocked && styles.recordingFlower ]}>
              <Image source={talkingFlowerImg} style={styles.flowerImageStyle} />
            </Animated.View>
          </Pressable>

          {/* 녹음 재생 버튼 추가 */}
          <TouchableOpacity
            style={[styles.confirmationButton, styles.playButton, !hasRecordingToPlay && styles.disabledButton]}
            onPress={playSound}
            disabled={!hasRecordingToPlay || isUiLocked} // 녹음된 URI가 없거나 UI가 잠겨있으면 비활성화
          >
            <Text style={styles.confirmationButtonText}>Play Recording</Text>
          </TouchableOpacity>

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
  playButton: { // Play 버튼 스타일 추가
    backgroundColor: Colors.wispyBlue || '#2196F3',
    marginTop: normalize(10), // 버튼 간 간격
  },
  disabledButton: { // 비활성화된 버튼 스타일
    opacity: 0.5,
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
