// screens/CamReadyScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AppState, Platform, Dimensions, PixelRatio, Image } from 'react-native';
import { useCameraPermissions, PermissionStatus } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import Wisker from '../components/Wisker';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

// --- Assets ---
const cameraImg = require('../assets/images/Camera.png');

// --- Utils ---
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

function CamReadyScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const appState = useRef(AppState.currentState);

  // 사용자가 앱 설정에서 권한을 변경하고 돌아왔을 때를 처리하는 로직
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isFocused
      ) {
        console.log('App has come to the foreground, re-checking permissions.');
        // 상태를 다시 확인하기 위해 현재 권한 상태를 가져옵니다.
        const { status } = await useCameraPermissions.getPermissionsAsync()
        if (status === PermissionStatus.GRANTED) {
          console.log('Permission granted after returning to app. Navigating...');
          navigation.replace('Camera');
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isFocused, navigation]);

  // 화면에 진입했을 때 권한이 이미 승인된 경우 바로 이동
  useEffect(() => {
    if (isFocused && permission?.granted) {
      navigation.replace('Camera');
    }
  }, [isFocused, permission, navigation]);

  // 권한 상태가 로딩 중일 때 빈 화면 표시
  if (!permission || !isFocused) {
    return <View style={styles.backgroundContainer} />;
  }

  // 권한이 거부된 경우, 사용자에게 요청하는 UI를 표시
  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer} />

        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              I need to see it{'\n'}
              through my <Text style={{ color: Colors.wispyYellow }}>magic lens</Text>!
            </Text>
          </View>
        </View>

        <View style={styles.characterImageContainer}>
          <Wisker source={cameraImg} />
        </View>

        <View style={styles.inputContainer}>
          <PrimaryButton
            onPress={requestPermission} // 버튼 클릭 시 권한 요청
            textColor={Colors.wispyRed}
          >
            Turn on camera
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    backgroundColor: Colors.wispyBlack,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    height: 50, // 헤더 공간 확보
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(25),
    lineHeight: normalize(40),
    fontFamily: Fonts.suitHeavy,
  },
  characterImageContainer: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});

export default CamReadyScreen;