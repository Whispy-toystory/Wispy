// CharacterGenerateScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";

// utils/normalizeText.js
import { Dimensions, Platform, PixelRatio } from 'react-native';

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


function CharacterGenerateScreen() {
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
          <View style={styles.textContainer}>
            <Text style={styles.mainText}>
              I am <Text style={{color:Colors.wispyYellow}}>Whisker</Text> the wishmaker, {'\n'}
              the magical wizard {'\n'}
              who will create your{'\n'}
              <Text style={{color:Colors.wispyOrange}}>special guardian</Text> friend!
            </Text>
          </View>
        </View>

        <View style={styles.characterImageContainer}>
          <Wisker />
        </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={() => console.log('Next pressed')}
              textColor={Colors.wispyBlue}
            >
              Next
            </PrimaryButton>
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
  textContainer: {
    flex: 2, 
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(25),
    lineHeight: normalize(40),
    fontFamily: Fonts.suitHeavy,
  },
  characterImageContainer: { 
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)', // 영역 확인용
  },
  buttonContainer: {
    padding: 10,
    justifyContent: 'center',
    paddingBottom: 20, 
    paddingHorizontal: 24, 
    backgroundColor: 'rgba(0,255,0,0.1)', // 영역 확인용
  },
});

export default CharacterGenerateScreen;