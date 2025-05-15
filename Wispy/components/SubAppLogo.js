// src/components/InAppLogo.js
import { Image, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const inappLogoSrc = require('../assets/images/logo2.png');

/**
 * @param {object} props
 * @param {import('react-native').ImageSourcePropType} [props.source=inappLogoSrc]
 * @param {object} [props.style]
 * @param {number} [props.width=120]
 * @param {number} [props.height=120]
 */
function InAppLogo({
  source = inappLogoSrc,
  style,
  width = 125, 
  height = 125,
}) {
  return (
    <Image
      source={source}
      style={[styles.logoBase, { width, height }, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logoBase: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingTop: Constants.statusBarHeight + 10, // 상태 표시줄 높이 + 10
    // position: 'absolute', // 절대 위치 지정
    top: 15,
    left: 10,
  },
});

export default InAppLogo;