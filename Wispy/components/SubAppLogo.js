// src/components/SubAppLogo.js
import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';
// import {useSafeAreaInsets, SafeAreaProvider} from 'react-native-safe-area-context';

const screenWidth = Dimensions.get('window').width;
const inappLogoSrc = require('../assets/images/logo2.png'); // 실제 로고 경로 확인

function SubAppLogo({
  source = inappLogoSrc,
  style, // 외부에서 추가 스타일을 받을 수 있도록
  // 로고 크기를 화면 너비에 비례하도록 기본값 설정
  width = screenWidth * 0.25, // 예: 화면 너비의 25%
  // height는 width와 aspectRatio를 사용하거나, width에 맞춰 자동 조절
}) {
  // const insets = useSafeAreaInsets(); // 안전 영역 간격 값 가져오기

  return (
    <Image
      source={source}
      style={[
        styles.logoBase,
        {
          top: 20, // 안전 영역 상단부터 10만큼 아래에 위치
          left: 20, // 안전 영역 왼쪽부터 15만큼 오른쪽에 위치
          width: width,
          height: width, // 로고가 정사각형이라고 가정, 아니라면 aspectRatio 사용 또는 height 직접 지정
        },
        style, // 외부에서 전달된 스타일 적용
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logoBase: {
    position: 'absolute', // 다른 요소와 관계없이 화면 기준으로 위치
  },
});

export default SubAppLogo;