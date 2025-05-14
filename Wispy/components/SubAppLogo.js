// src/components/InAppLogo.js
import { Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants'; // 상태 표시줄 높이를 가져오기 위해

// 인앱 로고 이미지 경로를 가져옵니다.
const inappLogoSrc = require('../assets/images/logo2.png');

/**
 * 로고 이미지를 표시하는 재사용 가능한 컴포넌트입니다.
 * @param {object} props - 컴포넌트 props
 * @param {import('react-native').ImageSourcePropType} [props.source=inappLogoSrc] - 표시할 이미지 소스. 기본값은 inappLogoSrc.
 * @param {object} [props.style] - 이미지에 적용할 추가적인 스타일 객체.
 * @param {number} [props.width=120] - 로고 이미지의 너비. 기본값은 120.
 * @param {number} [props.height=120] - 로고 이미지의 높이. 기본값은 120.
 */
function InAppLogo({
  source = inappLogoSrc,
  style,
  width = 125, 
  height = 125, // 기본 크기
}) {
  return (
    <Image
      source={source}
      style={[styles.logoBase, { width, height }, style]} // 기본 스타일, props 크기, 외부 스타일 순으로 적용
      resizeMode="contain" // 이미지 비율 유지
    />
  );
}

const styles = StyleSheet.create({
  logoBase: {
    alignSelf: 'flex-start', // 왼쪽 정렬 (또는 position: absolute 사용)
    marginBottom: 10, // 아래 여백
    paddingTop: Constants.statusBarHeight + 10, // 상태 표시줄 높이 + 10
    // position: 'absolute', // 절대 위치 지정
    top: 15,
    left: 10,
    // backgroundColor: 'rgba(0,0,0,0.1)', // 배경색을 반투명하게 설정
    // 또는 여기서 기본 크기를 설정하고 props로 덮어쓰게 할 수도 있습니다.
  },
});

export default InAppLogo;