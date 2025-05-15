// component/Wisker.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

const defaultWiskerImageSource = require('../assets/images/Wisker.png');

/**
 * 'Wisker' 캐릭터 이미지를 표시하는 재사용 가능한 컴포넌트입니다.
 * @param {object} props - 컴포넌트 props
 * @param {import('react-native').ImageSourcePropType} [props.source=defaultWiskerImageSource]
 * @param {object} [props.containerStyle]
 * @param {object} [props.imageStyle]
 * @param {string} [props.resizeMode='contain']
 */
function Wisker({
  source = defaultWiskerImageSource, 
  containerStyle,
  imageStyle,
  resizeMode = 'contain',
}) {
  // source prop이 유효한지 간단히 확인: null이나 undefined가 올 경우 대비
  const imageSourceToUse = source || defaultWiskerImageSource;

  return (
    <View style={[styles.defaultContainer, containerStyle]}>
      <Image
        source={imageSourceToUse}
        style={[styles.defaultImage, imageStyle]}
        resizeMode={resizeMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  defaultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultImage: {
    height: screenHeight * 0.48, // 화면 높이의 48%로 설정
    // width: screenWidth * 0.48, // 화면 넓이의 48%로 설정
    aspectRatio: 1,
    // marginBottom: 10,
  },
});

export default Wisker;