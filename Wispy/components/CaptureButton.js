// components/CaptureButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    iconButtonBody: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    textButtonBody: { // 기본 텍스트 버튼 스타일
        backgroundColor: '#007AFF', // 기본 파란색 (Done 버튼 등)
    },
    okButtonBody: { // "OK" 버튼 특별 스타일
        backgroundColor: '#60D060', // 밝은 녹색
    },
    doneButtonBody: { // "Done" 버튼 특별 스타일 (textButtonBody 기본값 사용 또는 다른 색 지정)
        backgroundColor: '#007AFF',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: normalize(22),
        fontWeight: 'bold',
    },
    disabledStyle: { // TouchableOpacity 자체에 적용될 수 있는 스타일 (예: 전체 투명도)
        opacity: 0.6,
    },
    disabledButtonVisuals: { // 버튼 내부 몸통의 시각적 비활성화
        backgroundColor: '#c0c0c0', // 예시: 배경색 변경
        // opacity: 0.6, // 이미 부모에서 opacity를 줬다면 중복될 수 있음
    },
    disabledTextVisuals: { // 비활성화 시 텍스트 스타일
        color: '#a0a0a0',
    },
    disabledInnerCircleVisuals: { // 비활성화 시 아이콘 버튼 내부 원 스타일
        backgroundColor: 'lightgrey',
    },
});