// components/InstructionText.js
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';

const windowWidth = Dimensions.get('window').width;

// utils/normalizeText.js
import { Platform, PixelRatio } from 'react-native';

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

const CHARACTER_IMAGE_SIZE = windowWidth * 0.25; // 캐릭터 이미지 크기 (화면 너비의 25%)
const BUBBLE_MAX_WIDTH = windowWidth * 0.7;    // 말풍선 최대 너비 (화면 너비의 70%)
const BUBBLE_PADDING_HORIZONTAL = windowWidth * 0.06; // 말풍선 내부 가로 패딩
const BUBBLE_PADDING_VERTICAL = windowWidth * 0.04;   // 말풍선 내부 세로 패딩
const CHARACTER_OFFSET_X = -CHARACTER_IMAGE_SIZE * 0.3; // 캐릭터가 말풍선과 겹치는 X축 오프셋
const BUBBLE_OFFSET_Y = CHARACTER_IMAGE_SIZE * 0.2;   // 말풍선이 캐릭터보다 아래로 내려오는 Y축 오프셋
const TAIL_SIZE = windowWidth * 0.04; // 말풍선 꼬리 크기

export default function InstructionText({ text, characterImageSource }) {
  if (!text && !characterImageSource) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      {characterImageSource && (
        <Image source={characterImageSource} style={styles.characterImage} />
      )}
      {text && (
        <View style={styles.bubbleContainer}>
          {/* 말풍선 꼬리 (왼쪽) */}
          <View style={styles.bubbleTail} />
          {/* 말풍선 본체 */}
          <View style={styles.bubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',     
  }, 
  characterImage: {
    width: CHARACTER_IMAGE_SIZE,
    height: CHARACTER_IMAGE_SIZE,
    resizeMode: 'contain',
    marginRight: CHARACTER_OFFSET_X, 
    zIndex: 0,                      
  },
  bubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: BUBBLE_OFFSET_Y,    
  },
  bubble: {
    backgroundColor: Colors.wispyYellow,
    paddingHorizontal: BUBBLE_PADDING_HORIZONTAL,
    paddingVertical: BUBBLE_PADDING_VERTICAL,
    borderRadius: 20,
    maxWidth: BUBBLE_MAX_WIDTH,
    zIndex: 1,                     
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderTopWidth: normalize(10),
    borderBottomWidth: normalize(10),
    borderRightWidth: normalize(15),
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: Colors.wispyYellow,
    marginRight: -1, 
  },
  text: {
    color: Colors.wispyBlack,
    fontFamily: Fonts.suitBold,
    fontSize: normalize(18), 
    textAlign: 'left',
    lineHeight: windowWidth * 0.055,
  },
});