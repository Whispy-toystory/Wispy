// components/InstructionText.js
import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';

const windowWidth = Dimensions.get('window').width;

// export default function InstructionText({ text }) {
//   return <Text style={styles.text}>{text}</Text>;
// }

// const styles = StyleSheet.create({
//   text: {
//     color: 'white',
//     fontSize: 16,
//     textAlign: 'center',
//     paddingHorizontal: 20,
//     marginBottom: 20, // 버튼과의 간격
//     fontWeight: '500',
//   },
// });

const CHARACTER_IMAGE_SIZE = windowWidth * 0.23; // 캐릭터 이미지 크기 (화면 너비의 23%)
const BUBBLE_MAX_WIDTH = windowWidth * 0.7;    // 말풍선 최대 너비 (화면 너비의 70%)
const BUBBLE_PADDING_HORIZONTAL = windowWidth * 0.06; // 말풍선 내부 가로 패딩
const BUBBLE_PADDING_VERTICAL = windowWidth * 0.04;   // 말풍선 내부 세로 패딩
const CHARACTER_OFFSET_X = -CHARACTER_IMAGE_SIZE * 0.3; // 캐릭터가 말풍선과 겹치는 X축 오프셋
const BUBBLE_OFFSET_Y = CHARACTER_IMAGE_SIZE * 0.25;   // 말풍선이 캐릭터보다 아래로 내려오는 Y축 오프셋

export default function InstructionText({ text, characterImageSource }) {
  if (!text && !characterImageSource) {
    return null;
  }

  return (
    // 이 wrapper는 CameraCaptureScreen의 instructionWrapper 내에서 중앙 정렬됨
    <View style={styles.wrapper}>
      {characterImageSource && (
        <Image source={characterImageSource} style={styles.characterImage} />
      )}
      {text && (
        <View style={styles.bubble}>
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start', // 캐릭터와 말풍선 상단 정렬
    alignSelf: 'center',     // 부모(instructionWrapper) 내에서 스스로 중앙 정렬
    // backgroundColor: 'rgba(255,0,0,0.05)', // 영역 확인용
    // 실제 너비는 내용물에 따라 결정됨
  },
  characterImage: {
    width: CHARACTER_IMAGE_SIZE,
    height: CHARACTER_IMAGE_SIZE,
    resizeMode: 'contain',
    marginRight: CHARACTER_OFFSET_X, // 말풍선이 캐릭터 오른쪽을 덮도록
    zIndex: 0,                      // 말풍선보다 뒤 (값이 작을수록 뒤)
    // marginTop: 0, // wrapper의 alignItems: 'flex-start'로 인해 상단에 붙음
  },
  bubble: {
    backgroundColor: Colors.wispyYellow,
    paddingHorizontal: BUBBLE_PADDING_HORIZONTAL,
    paddingVertical: BUBBLE_PADDING_VERTICAL,
    borderRadius: 20,
    maxWidth: BUBBLE_MAX_WIDTH,
    zIndex: 1,                      // 캐릭터 이미지보다 위에
    marginTop: BUBBLE_OFFSET_Y,     // 캐릭터 상단보다 약간 아래에서 시작하여 캐릭터가 더 위에 보이도록
    // 그림자 효과
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  text: {
    color: Colors.wispyBlack,
    fontFamily: Fonts.suitBold,
    fontSize: windowWidth * 0.04, // 화면 너비에 따른 폰트 크기 (조정 가능)
    textAlign: 'left',
    fontWeight: '500',
    lineHeight: windowWidth * 0.055, // 줄 간격도 비율로
  },
});