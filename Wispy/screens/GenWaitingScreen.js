// GenWaitingScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// utils/normalizeText.js
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const guardianimg = require('../assets/images/angelguardian.png');

const TOTAL_DURATION_SECONDS = 0.2 * 60;
const TIMER_END_TIME_STORAGE_KEY = 'genWaitingScreenTimerEndTime';

function GenWaitingScreen({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SECONDS);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [buttonText, setButtonText] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const appState = useRef(AppState.currentState);

  // 개발 모드에서만 타이머 초기화 (Fast Refresh/Live Reload 시)
  useEffect(() => {
    if (__DEV__) { // __DEV__는 React Native에서 제공하는 개발 모드 확인용 전역 변수
      console.log("개발 모드: 타이머 AsyncStorage 초기화 시도");
      AsyncStorage.removeItem(TIMER_END_TIME_STORAGE_KEY)
        .then(() => console.log("개발 모드: 타이머 AsyncStorage 초기화 완료"))
        .catch(err => console.error("개발 모드: 타이머 AsyncStorage 초기화 실패", err));
    }
  }, []);

  const formatTime = (seconds) => {
    if (seconds < 0) seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const updateButtonStateForTimerEnd = useCallback(() => {
    setIsTimerActive(false);
    setButtonText("Ready to wake your angel up?");
    setIsButtonDisabled(false);
    AsyncStorage.removeItem(TIMER_END_TIME_STORAGE_KEY);
  }, []);

  const initializeTimer = useCallback(async () => {
    try {
      const storedEndTimeString = await AsyncStorage.getItem(TIMER_END_TIME_STORAGE_KEY);
      const currentTimeSeconds = Math.floor(Date.now() / 1000);

      if (storedEndTimeString) {
        const storedEndTime = parseInt(storedEndTimeString, 10);
        const remaining = storedEndTime - currentTimeSeconds;

        if (remaining > 0) {
          setTimeLeft(remaining);
          setButtonText(formatTime(remaining));
          setIsButtonDisabled(true);
          setIsTimerActive(true);
        } else {
          updateButtonStateForTimerEnd();
        }
      } else {
        const newEndTime = currentTimeSeconds + TOTAL_DURATION_SECONDS;
        await AsyncStorage.setItem(TIMER_END_TIME_STORAGE_KEY, newEndTime.toString());
        setTimeLeft(TOTAL_DURATION_SECONDS);
        setButtonText(formatTime(TOTAL_DURATION_SECONDS));
        setIsButtonDisabled(true);
        setIsTimerActive(true);
      }
    } catch (e) {
      console.error("타이머 초기화 실패:", e);
      setTimeLeft(TOTAL_DURATION_SECONDS);
      setButtonText(formatTime(TOTAL_DURATION_SECONDS));
      setIsButtonDisabled(true); 
      setIsTimerActive(true);
    }
  }, [updateButtonStateForTimerEnd]);

  useEffect(() => {
    // __DEV__ 초기화 로직이 먼저 실행된 후 타이머 초기화
    const init = async () => {
        if (__DEV__) {
            await AsyncStorage.removeItem(TIMER_END_TIME_STORAGE_KEY);
        }
        initializeTimer();
    };
    init();

    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // 앱이 백그라운드에서 돌아올 때는 __DEV__ 초기화 없이 일반 initializeTimer 호출
        await initializeTimer();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [initializeTimer]);

  useEffect(() => {
    if (!isTimerActive) return;

    if (timeLeft <= 0) {
      updateButtonStateForTimerEnd();
      return;
    }

    setButtonText(formatTime(timeLeft));

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isTimerActive, updateButtonStateForTimerEnd]);

  const handleButtonPress = () => {
    console.log('천사가 준비되었습니다! 다음 행동 수행...');
    navigation.navigate('NameSpeakImage');
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.headerContainer]}>
          <SubAppLogo />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              Awesome!{'\n'}
              You did so well, we're creating{'\n'}
              a special guardian angel{'\n'}
              just for you! {'\n'}
              {isTimerActive && timeLeft > 0
                ? `In ${Math.ceil(timeLeft / 60)} minutes,\nyour very own angel will be ready!`
                : "Your very own angel is ready!"
              }
            </Text>
          </View>
        </View>

        <View style={styles.characterImageContainer}>
          <Wisker source={guardianimg} />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={handleButtonPress}
            disabled={isButtonDisabled}
            backgroundColor={Colors.wispyButtonYellow}
            textColor={Colors.wispyTextBlue}
          >
            {buttonText}
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 0.2,
    paddingHorizontal: 15,
  },
  contentContainer: {
    flex: 1,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(22),
    lineHeight: normalize(40),
    fontFamily: Fonts.suitHeavy,
    paddingHorizontal: 10,
  },
  characterImageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    paddingTop: 10,
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});

export default GenWaitingScreen;