// components/CaptureButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from "../constants/colors"; 
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


export default function CaptureButton({ onPress, title, disabled }) {
  return (
    <TouchableOpacity
      onPress={disabled ? () => {} : onPress} // disabled 상태일 때 onPress 막기 (이중 방어)
      style={[styles.buttonContainer, disabled && styles.disabledStyle]} // 비활성화 시 스타일 적용
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7} // 비활성화 시 터치 피드백 없애거나, 기본 activeOpacity 사용
    >
      {title ? (
        <View style={[styles.buttonBody, styles.textButtonBody, title === "OK" ? styles.okButtonBody : {}, disabled && styles.disabledButtonVisuals /* 내부 UI 요소도 비활성화 효과 */]}>
          <Text style={[styles.buttonText, disabled && styles.disabledTextVisuals]}>{title}</Text>
        </View>
      ) : (
        <View style={[styles.buttonBody, styles.iconButtonBody, disabled && styles.disabledButtonVisuals]}>
          <View style={[styles.innerCircle, disabled && styles.disabledInnerCircleVisuals]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBody: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.wispyBlack,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    iconButtonBody: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    textButtonBody: {
        backgroundColor: Colors.wispyBlue,
    },
    okButtonBody: { 
        backgroundColor: Colors.wispyGreen,
    },
    doneButtonBody: {
        backgroundColor: Colors.wispyBlue,
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.wispyWhite,
    },
    buttonText: {
        color: Colors.wispyWhite,
        fontSize: normalize(22),
        fontFamily: Fonts.suitBold
    },
    disabledStyle: {
        opacity: 0.6,
    },
    disabledButtonVisuals: {
        backgroundColor: Colors.wispyGrey 
    },
    disabledTextVisuals: { 
        color: Colors.wispyBlack,
    },
    disabledInnerCircleVisuals: {
        backgroundColor: 'lightgrey',
    },
});