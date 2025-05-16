// File: IntroGenScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// utils/normalizeText.js
// import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');


const designScreenWidth = 375; // 디자인 기준 스크린 너비 (조절 가능)

const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
    // 또는 Android에서 약간의 오프셋을 줄 수 있습니다.
    // return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}


function IntroGenScreen({ route }) {
  const userName = route && route.params ? route.params.userName || 'Guest' : 'Guest'; 
  // 예시로 하드코딩된 사용자 이름입니다. 실제로는 props나 전역 상태에서 가져와야 합니다.
  const [APIuserName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      
      <SafeAreaView style={styles.safeArea}>

        <View style={[styles.headerContainer]}>
          <SubAppLogo />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textcontainer}>
            <Text style={styles.mainText}>
              Ah, so you are <Text style={{fontWeight: 'bold', color: Colors.wispyYellow}}>{userName}</Text>!{'\n'}
              I can create your very own {'\n'}
              <Text style={{color:Colors.wispyOrange}}>special guardian</Text> friend, {'\n'}
              but <Text style={{color:Colors.wispyRed}}>only once</Text> by magic! 
            </Text>
          </View>
        </View>

        {/* 캐릭터 이미지 */}
        <View style={styles.charchterImageContainer}>
          <Wisker/>
        </View>

        {/* 버튼 */}
        <View style={styles.inputContainer}>
          <PrimaryButton
          onPress={() => console.log('Next pressed')}
          textColor={Colors.wispyBlue}>Okay, I understand</PrimaryButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 0.2,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
  contentContainer: { 
    flex: 1,
  },
  textcontainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(25),
    lineHeight: normalize(40),
    fontFamily: Fonts.suitHeavy,
  },
  charchterImageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.1)', // 영역 확인용
  },
  inputContainer: {
    backgroundColor: Colors.wispyWhite,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});

export default IntroGenScreen;