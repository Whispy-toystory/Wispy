// component/Wisker.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

// 컴포넌트 내부에 기본 이미지 경로를 선언합니다.
const defaultWiskerImageSource = require('../assets/images/Wisker.png');

/**
 * 'Wisker' 캐릭터 이미지를 표시하는 재사용 가능한 컴포넌트입니다.
 * 외부에서 source prop을 전달하면 해당 이미지를, 전달하지 않으면 기본 이미지를 사용합니다.
 * @param {object} props - 컴포넌트 props
 * @param {import('react-native').ImageSourcePropType} [props.source=defaultWiskerImageSource] - 표시할 이미지 소스. 기본값은 내부에 정의된 Wisker 이미지.
 * @param {object} [props.containerStyle]
 * @param {object} [props.imageStyle]
 * @param {string} [props.resizeMode='contain'] - 이미지 크기 조정 모드.
 */
function Wisker({
  source = defaultWiskerImageSource, // source prop을 받되, 전달되지 않으면 defaultWiskerImageSource 사용
  containerStyle,
  imageStyle,
  resizeMode = 'contain',
}) {
  // source prop이 유효한지 간단히 확인: null이나 undefined가 올 경우 대비
  const imageSourceToUse = source || defaultWiskerImageSource;

  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      <Image
        source={imageSourceToUse} // 결정된 이미지 소스를 사용
        style={[styles.defaultImage, imageStyle]}
        resizeMode={resizeMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  defaultContainer: {
    // 이 스타일은 이미지의 부모 컨테이너에 적용됩니다.
    justifyContent: 'center', // 내부 이미지를 수직 중앙 정렬
    alignItems: 'center',   // 내부 이미지를 수평 중앙 정렬
  },
  defaultImage: {
    // 이 스타일은 이미지 자체의 기본 크기 및 모양을 정의합니다.
    height: screenHeight * 0.48, // 화면 높이의 48%로 설정
    // width: screenWidth * 0.48, // 화면 넓이의 48%로 설정
    aspectRatio: 1, // 정사각형 비율 유지
    // marginBottom: 10, // 아래 여백
  },
});

export default Wisker;