// components/FramedImagePreview.js
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const FRAME_IMAGE = require('../assets/images/photoframe.png'); // 실제 경로 확인
const { width: windowWidth } = Dimensions.get('window');

// 프레임 이미지의 실제 비율과 내부 사진 영역 비율을 알아야 정확한 배치가 가능합니다.
// 아래 값들은 photoframe.png 이미지에 맞춰 조정해야 합니다.
// 예시: 프레임 이미지의 가로:세로 비율이 1:1.2 이고,
// 내부 사진 영역이 프레임 너비의 80%, 높이의 70% 정도라고 가정.
const FRAME_ASPECT_RATIO = 1 / 1.5; // 프레임의 가로/세로 비율 (조정 필요)
const PHOTO_AREA_WIDTH_RATIO = 0.84; // 프레임 너비 대비 사진 영역 너비 비율 (조정 필요)
const PHOTO_AREA_HEIGHT_RATIO = 0.73; // 프레임 높이 대비 사진 영역 높이 비율 (조정 필요)
const PHOTO_AREA_OFFSET_TOP_RATIO = 0.07; // 프레임 상단에서 사진 영역 시작점 오프셋 비율 (조정 필요)
const PHOTO_AREA_OFFSET_LEFT_RATIO = 0.075; // 프레임 좌측에서 사진 영역 시작점 오프셋 비율 (조정 필요)

// 6. 라벨이 위치할 하단 여백의 특성 (사진 영역 하단부터 프레임 하단까지의 높이 비율)
const LABEL_AREA_HEIGHT_RATIO = 1 - PHOTO_AREA_OFFSET_TOP_RATIO - PHOTO_AREA_HEIGHT_RATIO - 0.03; // 프레임 하단 테두리 두께 제외 (0.03은 예시)
// 7. 라벨의 상단 위치 (프레임 높이 대비, 사진 영역 바로 아래)
const LABEL_OFFSET_TOP_RATIO = PHOTO_AREA_OFFSET_TOP_RATIO + PHOTO_AREA_HEIGHT_RATIO + 0.01; // 사진 바로 아래 약간의 여백 (0.01은 예시)


export default function FramedImagePreview({ imageUri, label, containerWidth }) {
  const frameWidth = containerWidth;
  const frameHeight = frameWidth / FRAME_ASPECT_RATIO;

  const photoWidth = frameWidth * PHOTO_AREA_WIDTH_RATIO;
  const photoHeight = frameHeight * PHOTO_AREA_HEIGHT_RATIO;
  const photoTop = frameHeight * PHOTO_AREA_OFFSET_TOP_RATIO;
  const photoLeft = frameWidth * PHOTO_AREA_OFFSET_LEFT_RATIO;

  const labelTop = frameHeight * LABEL_OFFSET_TOP_RATIO;
  const labelAreaHeight = frameHeight * LABEL_AREA_HEIGHT_RATIO;


  return (
    <View style={[styles.container, { width: frameWidth }]}>
      <View style={{ width: frameWidth, height: frameHeight }}>
        <Image source={FRAME_IMAGE} style={styles.frameImage} />
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.capturedImage,
              {
                width: photoWidth,
                height: photoHeight,
                top: photoTop,
                left: photoLeft,
              },
            ]}
          />
        )}
        {/* 라벨을 프레임 하단 여백에 위치 */}
        {label && (
          <View style={[styles.labelContainer, {top: labelTop, height: labelAreaHeight, paddingHorizontal: photoLeft }]}>
            <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">{label}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 15,
  },
  frameImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  capturedImage: {
    position: 'absolute',
    resizeMode: 'cover',
  },
  labelContainer: {
    position: 'absolute',
    left: 0, // photoLeft와 동일하게 설정하여 사진 영역과 좌우 정렬 맞춤
    right: 0, // photoLeft와 동일하게 설정하여 사진 영역과 좌우 정렬 맞춤
    // top, height는 인라인 스타일로 설정
    justifyContent: 'center', // 텍스트 수직 중앙 정렬
    alignItems: 'center',     // 텍스트 수평 중앙 정렬
    // backgroundColor: 'rgba(0,255,0,0.1)', // 영역 확인용
  },
  label: {
    fontSize: windowWidth * 0.032, // 프레임 크기에 맞춰 조절
    fontWeight: '600', // 약간 두껍게
    color: '#555',    // 프레임과 어울리는 색상
    textAlign: 'center',
  },
});