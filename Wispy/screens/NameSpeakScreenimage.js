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
import SubAppLogo from '../components/SubAppLogo'; // Ensure this path is correct
import Colors from "../constants/colors";     // Ensure this path is correct
import Fonts from '../constants/fonts';       // Ensure this path is correct
import Wisker from '../components/Wisker';     // Ensure this path is correct
import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio'; // Updated imports

// normalize function
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scaleFactor = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Image assets
const guardianimg = require('../assets/images/angelguardian.png'); // Ensure this path is correct
const talkingFlowerImg = require('../assets/images/talking_flower.png'); // Ensure this path is correct

const MAX_CALLS = 5;

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

function NameSpeakScreen({ navigation }) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const appState = useRef(AppState.currentState);
  const pressInActiveRef = useRef(false); 

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  // isUiLocked is a general state for disabling button and showing "busy" UI
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

  // Request permissions on mount
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
    pressInActiveRef.current = false; // Ensure press state is reset
    if (audioRecorder.isRecording) {
      console.log("resetUiAndStopRecording: audioRecorder is recording, attempting to stop.");
      try {
        await audioRecorder.stop();
        console.log("resetUiAndStopRecording: audioRecorder.stop() successful.");
      } catch (e) {
        console.warn("resetUiAndStopRecording: Error stopping audioRecorder:", e.message);
      }
    } else {
      console.log("resetUiAndStopRecording: audioRecorder was not recording.");
    }
    // Reset URI and UI states
    setRecordedURI(null); 
    setIsUiLocked(false); 
    setFeedbackText(feedbackMsg);
    setShowConfirmationPrompt(false); // Hide confirmation prompt on reset
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      console.log(`AppState changed from ${appState.current} to ${nextAppState}`);
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        if (isUiLocked || audioRecorder.isRecording) { // If UI was locked or recorder was active
          console.log('App re-activated, resetting UI and stopping any active recording.');
          await resetUiAndStopRecording("Welcome back! Press and hold to try again.");
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (audioRecorder.isRecording) {
        console.log("Component unmounting, stopping recording.");
        audioRecorder.stop().catch(e => {
            if (e.message && (e.message.includes("already been unloaded") || e.message.includes("not recording") || e.message.includes("stop failed"))) {
                console.log("Recording was already stopped/unloaded or failed to stop on unmount (likely native issue).");
            } else {
                console.warn("Error stopping recording on unmount:", e);
            }
        });
      }
    };
  }, [isUiLocked, audioRecorder.isRecording]); // Depend on relevant states

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
    console.log("startRecording: Attempting. pressInActiveRef:", pressInActiveRef.current);
    if (!pressInActiveRef.current) { 
        console.log("startRecording: Press no longer active. Aborting.");
        await resetUiAndStopRecording(); // Reset if press was released prematurely
        return;
    }
    
    setIsUiLocked(true); 
    setFeedbackText('Listening...');
    setShowConfirmationPrompt(false);

    try {
      console.log("startRecording: Preparing to record...");
      await audioRecorder.prepareToRecordAsync(); 
      
      if (!pressInActiveRef.current) { 
          console.log("startRecording: User lifted finger during prepareToRecordAsync. Aborting record.");
          await resetUiAndStopRecording();
          return;
      }

      console.log("startRecording: Starting actual recording with audioRecorder.record()...");
      await audioRecorder.record(); 
      console.log('Recording started. audioRecorder.isRecording:', audioRecorder.isRecording);
      if (!audioRecorder.isRecording) { // Double check if hook updated its state
          throw new Error("AudioRecorder failed to start recording (isRecording state is false).");
      }

    } catch (err) {
      console.error('Failed to start recording session:', err);
      await resetUiAndStopRecording('Could not start listening. Please try again.');
    }
  }

  async function stopRecording() {
    console.log("stopRecording: Called. audioRecorder.isRecording:", audioRecorder.isRecording);
    pressInActiveRef.current = false; 

    if (!audioRecorder.isRecording) {
      console.log("stopRecording: audioRecorder is not recording. Resetting UI if it was locked.");
      if(isUiLocked) await resetUiAndStopRecording(); 
      return;
    }
    
    // Keep isUiLocked true for "Thinking..." feedback
    setFeedbackText('Got it! Thinking...');
    try {
      console.log("stopRecording: Calling audioRecorder.stop()...");
      await audioRecorder.stop();
      const uri = audioRecorder.uri; 
      
      if (!uri) {
          console.error("stopRecording: Failed to get URI after stopping. Recording might not have saved.");
          throw new Error("Failed to get recording URI.");
      }
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
    } catch (error) {
      console.error('Failed to stop or process recording:', error);
      setFeedbackText('Oops! Something went wrong. Please try again.');
    } finally {
      console.log("stopRecording: finally block. Resetting UI lock.");
      setIsUiLocked(false); 
    }
  }

  const handleNameConfirmation = (isCorrect) => {
    setShowConfirmationPrompt(false); // Always hide prompt after interaction
    if (isCorrect) {
      setGuardianName(currentAttemptText);
      setNameConfirmed(true);
      setCallCount(0);
    } else {
      // Don't call resetUiAndStopRecording here as it might stop an ongoing recording if user taps No quickly
      setFeedbackText('Okay, let\'s try that again. Press and hold the flower to say the name.');
      setCurrentAttemptText('');
    }
  };

  const onPressInFlower = async () => {
    console.log("onPressInFlower: Triggered. isUiLocked:", isUiLocked, "audioRecorder.isRecording:", audioRecorder.isRecording, "hasPermission:", hasPermission);
    if (isUiLocked || audioRecorder.isRecording) { // Use audioRecorder.isRecording as a more direct check
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
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if(!status.granted) {
            Alert.alert("Permission Denied", "Microphone permission is required. Please enable it in app settings.");
            resetUiAndStopRecording("Microphone permission needed."); // Reset UI
            pressInActiveRef.current = false; 
            return;
        }
        setHasPermission(true); // Update permission state
    }
    
    // setIsPreparing is removed, isUiLocked will handle the UI lock
    await startRecording(); 
  };

  const onPressOutFlower = async () => {
    console.log("onPressOutFlower: Triggered. pressInActiveRef was:", pressInActiveRef.current, "audioRecorder.isRecording:", audioRecorder.isRecording);
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
    const wasPressActive = pressInActiveRef.current;
    pressInActiveRef.current = false; 

    if (callCount === MAX_CALLS && nameConfirmed) return;

    // If the hook indicates it's recording, then stop it.
    // Or if the UI was locked (isUiLocked) and the press was active (wasPressActive),
    // it implies a recording was intended or in progress.
    if (audioRecorder.isRecording || (wasPressActive && isUiLocked)) { 
        await stopRecording();
    } else { 
        console.log("onPressOutFlower: No active recording to stop or UI was not in a recording-intended state. Resetting if UI was 'Listening...'.");
        if (isUiLocked && feedbackText === 'Listening...') { // If UI was stuck in listening
            resetUiAndStopRecording();
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

          {showConfirmationPrompt && !isUiLocked && ( // Show prompt if UI is not locked
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
            disabled={(callCount === MAX_CALLS && nameConfirmed) || isUiLocked } // Simplified disabled state
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
    flex: 0.1, justifyContent: 'flex-start', alignItems: 'flex-start',
    paddingHorizontal: normalize(15), paddingTop: Platform.OS === 'android' ? normalize(20) : normalize(10),
  },
  instructionTextContainer: {
    flex: 0.25, justifyContent: 'center', alignItems: 'center', paddingHorizontal: normalize(20),
  },
  mainText: {
    textAlign: 'center', color: Colors.wispyWhite, fontSize: normalize(18),
    lineHeight: normalize(28), fontFamily: Fonts.suitHeavy,
  },
  characterImageContainer: {
    flex: 0.35, justifyContent: 'center', alignItems: 'center', paddingBottom: normalize(10),
  },
  interactiveFlowerArea: {
    flex: 0.3, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: normalize(20),
  },
  speechBubbleWrapper: { alignItems: 'center', marginBottom: normalize(10), minHeight: normalize(60) },
  speechBubbleContent: {
    backgroundColor: Colors.wispyButtonYellow, paddingHorizontal: normalize(18), paddingVertical: normalize(12),
    borderRadius: normalize(15), maxWidth: '90%',
  },
  speechBubbleText: {
    textAlign: 'center', color: Colors.wispyTextBlue, fontSize: normalize(14),
    fontFamily: Fonts.suitHeavy, lineHeight: normalize(18),
  },
  speechBubblePointer: {
    width: 0, height: 0, borderLeftWidth: normalize(10), borderRightWidth: normalize(10),
    borderTopWidth: normalize(15), borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: Colors.wispyButtonYellow, alignSelf: 'center',
  },
  confirmationContainer: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    width: '85%', marginTop: normalize(5), marginBottom: normalize(10),
  },
  confirmationButton: {
    paddingVertical: normalize(10), paddingHorizontal: normalize(15), borderRadius: normalize(20),
    minWidth: normalize(110), alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2,
  },
  yesButton: { backgroundColor: Colors.wispyGreen || '#4CAF50' },
  noButton: { backgroundColor: Colors.wispyRed || '#F44336' },
  confirmationButtonText: {
    color: Colors.wispyWhite || '#FFFFFF', fontFamily: Fonts.suitBold || Fonts.suitHeavy, fontSize: normalize(14),
  },
  flowerTouchable: {},
  flowerImageStyle: { width: normalize(130), height: normalize(130) },
  recordingFlower: { opacity: 0.7 }
});

export default NameSpeakScreen;
