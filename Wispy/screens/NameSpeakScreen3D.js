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
const MAX_CALLS = 5;
const RECORDING_COOLDOWN_MS = 500;

// --- 오디오 녹음 대신 사용할 가상 이름 인식 함수 ---
const recognizeMockName = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      const names = ["Luna", "Sol", "Stella", "Aria", "Bella", "Kai"];
      resolve(names[Math.floor(Math.random() * names.length)]);
    }, 750); // 약간의 딜레이를 줌
  });
};


function NameSpeakImageScreen({ navigation }) {
  // --- Refs ---
  const scaleValue = useRef(new Animated.Value(1)).current;
  const lastPressTimeRef = useRef(0);

  // --- State ---
  const [isUiLocked, setIsUiLocked] = useState(false);
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

  // --- Effects ---

  // 진행 상태에 따른 안내 문구 변경
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

  // 목표 달성 시 다음 화면으로 자동 전환
  useEffect(() => {
    if (nameConfirmed && callCount === MAX_CALLS) {
      const timer = setTimeout(() => {
        navigation.navigate('PlayStartLoading');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [nameConfirmed, callCount, navigation]);


  // --- 이벤트 핸들러 ---
  
  const handlePressInFlower = () => {
    const now = Date.now();
    if (now - lastPressTimeRef.current < RECORDING_COOLDOWN_MS || isUiLocked) {
      return;
    }
    if (callCount === MAX_CALLS && nameConfirmed) {
      setFeedbackText(`${guardianName} is already waking up!`);
      return;
    }

    setIsUiLocked(true);
    setShowConfirmationPrompt(false);
    setFeedbackText('Listening...');
    Animated.spring(scaleValue, { toValue: 0.85, useNativeDriver: true, friction: 4, tension: 60 }).start();
  };

  const handlePressOutFlower = async () => {
    Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true, friction: 3, tension: 40 }).start();
    
    // UI가 잠겨있지 않다면(버튼을 누르지 않았다면) 아무것도 하지 않음
    if (!isUiLocked) return;

    if (callCount === MAX_CALLS && nameConfirmed) return;

    setFeedbackText('Got it! Thinking...');

    // 가상으로 이름 인식
    const recognizedName = await recognizeMockName();

    if (!nameConfirmed) {
      setCurrentAttemptText(recognizedName);
      setFeedbackText(`Did you say: "${recognizedName}"?`);
      setShowConfirmationPrompt(true);
    } else {
      setCallCount(prevCount => prevCount + 1);
    }
    
    setIsUiLocked(false);
    lastPressTimeRef.current = Date.now();
  };
  
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
