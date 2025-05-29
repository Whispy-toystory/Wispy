// src/components/SubAppLogo.js
import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const inappLogoSrc = require('../assets/images/logo2.png');
function SubAppLogo({
  source = inappLogoSrc,
  style,
  width = screenWidth * 0.25,
}) {

  return (
    <Image
      source={source}
      style={[
        styles.logoBase,
        {
          left: 20,
          width: width,
          height: width * 0.45,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logoBase: {
    position: 'absolute',
  },
});

export default SubAppLogo;