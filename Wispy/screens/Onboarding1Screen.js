import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import SubAppLogo from '../components/SubAppLogo';
import PrimaryButton from '../components/PrimaryButton';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import Quite from '../assets/images/quite.png';

const screenHeight = Dimensions.get('window').height;

function Onboarding1Screen() {
  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View>
            <SubAppLogo />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>You've discovered</Text>
          <View style={styles.inlineTextLogo}>
            <Text style={styles.mainText}> our secret</Text>
            <SubAppLogo style={styles.inlineLogo} />
          </View>
          <Text style={styles.mainText}>Wonderland!</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={Quite} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.inputContainer}>
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

export default Onboarding1Screen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 141,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: 25,
    lineHeight: 40,
    fontFamily: Fonts.suitHeavy,
  },
  inlineTextLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 60,
  },
  inlineLogo: {
    width: 80,
    height: 80,
    marginLeft: 125,
  },
  imageContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 313,
    height: 313,
  },
  inputContainer: {
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});
