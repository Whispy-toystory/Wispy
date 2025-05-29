// components/GuidelineOverlay.js
import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const GUIDELINE_IMAGES = {
  front: require('../assets/images/doll_front_guideline.png'),
  side_right: require('../assets/images/doll_right_guideline.png'),
  side_left: require('../assets/images/doll_left_guideline.png'),
  back: require('../assets/images/doll_back_guideline.png'),
};

export default function GuidelineOverlay({ type }) {
    if (!type) return null; // 가이드라인이 없는 단계

    const guidelineImageSource = GUIDELINE_IMAGES[type];

    // type에 따라 다른 스타일을 적용
    let guidelineStyle = {};
    if (type === 'front') {
        guidelineStyle = styles.frontGuideline;
    } else if (type === 'side_right' || type === 'side_left') {
        guidelineStyle = styles.sideGuideline;
    } else if (type === 'back') { 
        guidelineStyle = styles.backGuideline;
    }

    return (
        <View style={styles.container}>
            {guidelineImageSource ? (
                <Image source={guidelineImageSource} style={[styles.guidelineImage, guidelineStyle]} resizeMode="contain" />
        ) : (
            <View style={[styles.guidelineBox, guidelineStyle]} />
        )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', // Camera 뷰 위에 겹치도록
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    guidelineBox: {
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 15,
    },
    frontGuideline: { 
        width: windowWidth * 1,
        height: windowHeight * 1,
    },
    sideGuideline: { 
        width: windowWidth * 1,
        height: windowHeight * 1,
    },
    backGuideline: {
        width: windowWidth * 1,
        height: windowHeight * 1,
    },
    guidelineImage: {
      opacity: 1, // 반투명하게
      paddingBottom: 30, // 아래쪽 여백
    },
});