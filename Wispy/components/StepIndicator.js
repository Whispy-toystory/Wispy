// components/StepIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

// utils/normalizeText.js
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const designScreenWidth = 375;

const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}


export default function StepIndicator({ text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_WIDTH * 0.02,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
  text: {
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitExtraBold,
    fontSize: normalize(16),
    textAlign: 'center',
  },
});