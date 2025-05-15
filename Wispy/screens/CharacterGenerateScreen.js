// CharacterGenerateScreen.js
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function CharacterGenerateScreen() {
  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* 로고는 absolute positioning이므로 레이아웃 흐름에 영향을 주지 않고 위에 뜹니다. */}
        <SubAppLogo />

        <View style={styles.mainContentContainer}>
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
  mainContentContainer: { 
    flex: 3.5,
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 10,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: screenWidth < 380 ? 20 : 24,
    lineHeight: screenWidth < 380 ? 30 : 36,
    fontFamily: Fonts.suitHeavy,
  },
  characterImageContainer: { 
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)', // 영역 확인용
  },
  inputContainer: {
    marginTop: 0,
    padding: 10,
    // backgroundColor: '#72063c',
    paddingBottom: 25,
  },
  buttonContainer: {
    flex: 1, 
    justifyContent: 'center',
    paddingBottom: 20, 
    paddingHorizontal: 24, 
    // backgroundColor: 'rgba(0,255,0,0.1)', // 영역 확인용
  },
});

export default CharacterGenerateScreen;