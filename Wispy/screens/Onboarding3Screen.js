import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import Happy from '../assets/images/happy.png';
import WispyLogo from '../assets/images/logo2.png';

const screenHeight = Dimensions.get('window').height;

function Onboarding3Screen() {
  const name = 'Robin';

  const handleBackPress = () => {
    console.log('Back 버튼 눌림!');
  };

  const handleNextPress = () => {
    console.log('Next 버튼 눌림!');
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image source={WispyLogo} style={styles.logoTopLeft} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.greetingText}>
            Hi <Text style={styles.nameText}>{name}</Text>
          </Text>
          <Text style={styles.middleText}>
            What an <Text style={styles.highlightText}>awesome name!</Text>
          </Text>
          <Text style={styles.thankYouText}>Thank you for sharing!</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={Happy} style={styles.happyImage} resizeMode="contain" />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={handleBackPress}
            backgroundColor="white"
            textColor={Colors.wispyBlue}
            style={styles.button}
          >
            Back
          </PrimaryButton>
          <PrimaryButton
            onPress={handleNextPress}
            backgroundColor={Colors.wispyButtonYellow}
            textColor={Colors.wispyTextBlue}
            style={styles.button}
          >
            Next
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default Onboarding3Screen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logoContainer: {
    marginTop: 8,
    marginLeft: 24,
  },
  logoTopLeft: {
    width: 80,
    height: 40,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  greetingText: {
    fontSize: 22,
    fontFamily: Fonts.suitHeavy,
    color: 'white',
    marginBottom: 8,
  },
  nameText: {
    color: Colors.wispyDarkerPink,
  },
  middleText: {
    fontSize: 22,
    fontFamily: Fonts.suitHeavy,
    color: 'white',
  },
  highlightText: {
    color: Colors.wispyOrange,
  },
  thankYouText: {
    fontSize: 22,
    fontFamily: Fonts.suitHeavy,
    color: 'white',
    marginTop: 8,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginVertical: 30,
  },
  happyImage: {
    width: 313,
    height: 313,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});
