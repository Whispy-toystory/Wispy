// screens/CamReadyScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, AppState, Platform } from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import { Dimensions, PixelRatio } from 'react-native';
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
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

  useEffect(() => {
    // AppState의 변경을 감지하는 리스너를 설정합니다.
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      // 앱이 비활성 상태였다가 다시 활성 상태로 돌아왔고, 현재 화면이 포커스 상태일 때
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isFocused
      ) {
        console.log('App has come to the foreground, re-checking permissions.');
        // 권한 상태를 다시 한번 가져옵니다.
        const freshPermissions = await requestPermission();
        if (freshPermissions.granted) {
          console.log('Permission granted after returning to app. Navigating...');
          navigation.replace('Camera');
        }
      }
      appState.current = nextAppState;
    });

    // 컴포넌트가 사라질 때 리스너를 정리합니다.
    return () => {
      subscription.remove();
    };
  }, [isFocused, navigation, requestPermission]); // isFocused가 바뀔 때마다 리스너를 재설정할 수 있도록 추가

  // 권한이 이미 승인된 상태로 이 화면에 진입한 경우
  useEffect(() => {
    if (isFocused && permission?.granted) {
      navigation.replace('Camera');
    }
  }, [isFocused, permission, navigation]);

  // 권한이 아직 결정되지 않았거나, 포커스되지 않았을 때
  if (!permission || !isFocused) {
    return <View style={styles.centered} />;
  }

  // 권한 요청 UI
  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          To take photos, you need to allow camera access.
        </Text>
        <PrimaryButton
          onPress={requestPermission} // 버튼 클릭 시 권한 요청
          backgroundColor={Colors.wispyButtonYellow}
          textColor={Colors.wispyTextBlue}
        >
          Allow Camera
        </PrimaryButton>
      </View>
    );
  }
  
  return <View style={styles.centered} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.wispyBlack
  },
  permissionText: {
    fontFamily: Fonts.suitHeavy,
    color: Colors.wispyWhite,
    fontSize: normalize(18),
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default CamReadyScreen;