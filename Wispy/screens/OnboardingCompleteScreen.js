import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import WispyLogo from '../assets/images/logo2.png';
import Complete from '../assets/images/Complete.png';

const screenHeight = Dimensions.get('window').height;

function OnboardingCompleteScreen({ navigation }) { 
  const handleNext = () => {
    console.log('Next pressed');
    // TODO: 다음 화면으로 이동하는 로직추가 필요
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.subAppLogoContainer}>
          <Image source={WispyLogo} style={styles.logoTopLeft} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Thank you! I'll share your {'\n'}
            special information with {'\n'}
            Whisker! 
            </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={Complete} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={handleNext}
            textColor={Colors.wispyBlue}
            backgroundColor={Colors.wispyButtonYellow}
          >
            Next
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default OnboardingCompleteScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  subAppLogoContainer: {
    marginLeft: 24,
    marginTop: 8,
  },
  logoTopLeft: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: screenHeight * 0.1,
    marginBottom: screenHeight * 0.05,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: 25,
    lineHeight: 40,
    fontFamily: Fonts.suitHeavy,
  },
  subText: {
    color: Colors.wispyButtonYellow,
    fontFamily: Fonts.suitHeavy,
  },
  imageContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 313,
    height: 313,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    marginTop: 'auto',
}
});