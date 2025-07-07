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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { useAzureSpeech } from '../components/useAzureSpeech';
import { useExpoVoice } from '../components/useExpoVoice';
import { useOnboarding } from '../contexts/OnboardingContext';

// --- 화면 크기 정규화 함수 ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scaleFactor = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// --- 이미지 리소스 ---
const guardianimg = require('../assets/images/angelguardian.png');
const talkingFlowerImg = require('../assets/images/talking_flower.png');

// --- 상수 ---
const MAX_CALLS = 3;
const RECORDING_COOLDOWN_MS = 500;


function NameSpeakImageScreen({ navigation }) {
  // --- Refs ---
  const scaleValue = useRef(new Animated.Value(1)).current;
  const lastPressTimeRef = useRef(0);
  const { updateOnboardingData } = useOnboarding();
  
  // --- State 관리 ---
  const [isUiLocked, setIsUiLocked] = useState(false);
  const [guardianName, setGuardianName] = useState(null);
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [currentAttemptText, setCurrentAttemptText] = useState('');
  const [showConfirmationPrompt, setShowConfirmationPrompt] = useState(false);
  const [callCount, setCallCount] = useState(0);

  const { recognizedText, isRecognizing, startRecognizing, stopRecognizing } = useAzureSpeech();

  const [hasInteracted, setHasInteracted] = useState(false);
  const [feedbackText, setFeedbackText] = useState(
    "I'm a magical talking flower! \nIf you whisper to it, your special friend will hear your words"
  );
  const [mainInstructionText, setMainInstructionText] = useState(
    "Wow! Almost ready!\nNow tell the talking flower\nyour guardian angel's name!"
  );

  // --- Effects ---
  // 진행 상태에 따른 안내 문구 변경
  useEffect(() => {
    if (!hasInteracted || isUiLocked) return;
    
    if (nameConfirmed && guardianName) {
      if (callCount === 0) {
        setMainInstructionText(`Great! ${guardianName} is your angel!\nNow call ${guardianName}'s name\n${MAX_CALLS} times to the flower!`);
        if (!showConfirmationPrompt) setFeedbackText(`Press and hold the flower to call ${guardianName}. (0/${MAX_CALLS})`);
      } else if (callCount > 0 && callCount < MAX_CALLS) {
        setMainInstructionText(`Keep going!\nCall ${guardianName}'s name\n${MAX_CALLS - callCount} more times!`);
        if (!showConfirmationPrompt) setFeedbackText(`${guardianName} heard you! (${callCount}/${MAX_CALLS}) Call again!`);
      } else if (callCount === MAX_CALLS) {
        setMainInstructionText(`Amazing!\nYou've called ${guardianName}'s name ${MAX_CALLS} times!`);
        if (!showConfirmationPrompt) setFeedbackText(`${guardianName} is waking up!`);
      }
    } else { // 이름 미확인 상태
        setMainInstructionText("Wow! Almost ready!\nNow tell the talking flower\nyour guardian angel's name!");
        if (!showConfirmationPrompt) {
          setFeedbackText("Press and hold the flower, then say the name.");
        }
    }
  }, [hasInteracted, nameConfirmed, guardianName, callCount, isUiLocked, showConfirmationPrompt]);

  // 목표 달성 시 다음 화면으로 자동 전환
  useEffect(() => {
    if (nameConfirmed && callCount === MAX_CALLS) {
      const timer = setTimeout(() => {
        navigation.navigate('PlayStartLoading');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nameConfirmed, callCount, navigation]);

  useEffect(() => {
    // 인식 중이 아니고, UI 잠금이 해제된 상태에서, 인식된 텍스트가 있을 때만 실행
    if (!isRecognizing && !isUiLocked && recognizedText) {
      if (!nameConfirmed) { // 이름 확인 단계
        setCurrentAttemptText(recognizedText);
        setFeedbackText(`Did you say: "${recognizedText}"?`);
        setShowConfirmationPrompt(true);
      } else { // 이름 반복 호출 단계
        if (recognizedText.toLowerCase().includes(guardianName.toLowerCase())) {
          setCallCount(prevCount => prevCount + 1);
        } else {
          setFeedbackText(`Please call for ${guardianName}! Let's try again.`);
        }
      }
    }
  }, [recognizedText, isRecognizing, isUiLocked]);

  // --- 이벤트 핸들러 ---
  const handlePressInFlower = () => {
    const now = Date.now();
    if (now - lastPressTimeRef.current < RECORDING_COOLDOWN_MS || isUiLocked) return;
    if (callCount === MAX_CALLS && nameConfirmed) return;

    if (!hasInteracted) setHasInteracted(true); // 첫 상호작용 기록

    setIsUiLocked(true);
    setShowConfirmationPrompt(false);
    setFeedbackText('Listening...');
    Animated.spring(scaleValue, { toValue: 0.85, useNativeDriver: true, friction: 4, tension: 60 }).start();
    startRecognizing();
  };

  const handlePressOutFlower = async () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
    
    if (!isUiLocked) return;
    if (callCount === MAX_CALLS && nameConfirmed) return;
    
    setFeedbackText('Got it! Thinking...'); // <<< 이 텍스트가 이제 제대로 표시됩니다.
    await stopRecognizing();
    
    setIsUiLocked(false);
    lastPressTimeRef.current = Date.now();
  };
  
  const handleNameConfirmation = (isCorrect) => {
    setShowConfirmationPrompt(false);
    if (isCorrect) {
      const newGuardianName = currentAttemptText;
      setGuardianName(newGuardianName);
      setNameConfirmed(true);
      setCallCount(0);
      updateOnboardingData({ GuardianName: newGuardianName }); 

    } else {
      setFeedbackText('Okay, let\'s try that again. Press and hold the flower to say the name.');
    }
    setCurrentAttemptText('');
    setIsUiLocked(false);
    lastPressTimeRef.current = Date.now();
  };

  // --- 렌더링 ---
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
          <Image source={guardianimg} style={styles.guardianGlowStyle} blurRadius={40}/>
          <Image source={guardianimg} style={styles.guardianImageStyle}/>
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
            onPressIn={handlePressInFlower}
            onPressOut={handlePressOutFlower}
            disabled={(callCount === MAX_CALLS && nameConfirmed) || (showConfirmationPrompt && !isUiLocked)}
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
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: normalize(50),
    },
    guardianGlowStyle: {
        width: normalize(270),
        height: normalize(270),
        borderRadius: normalize(150),
        tintColor: 'rgb(0,4,225)',
        position: 'absolute',
        opacity: 0.3,
        bottom: normalize(35),
    },
    guardianImageStyle: {
        width: normalize(230),
        height: normalize(230),
        borderRadius: normalize(90),
    },
    interactiveFlowerArea: {
        flex: 0.3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: normalize(20),
    },
    speechBubbleWrapper: {
        alignItems: 'center',
        marginBottom: normalize(5),
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
    flowerImageStyle: {
        width: normalize(150),
        height: normalize(150)
    },
});

export default NameSpeakImageScreen;
