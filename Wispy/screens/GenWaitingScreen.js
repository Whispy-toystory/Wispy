// GenWaitingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";

import { Dimensions, Platform, PixelRatio } from 'react-native';

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

const guardianimg = require('../assets/images/angelguardian.png');

function GenWaitingScreen({ navigation }) {

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
                Awesome!{'\n'} 
                You did so well,{'\n'}
                we're creating a special guardian angel just for you! {'\n'}
                In 30 minutes, your very own angel will be ready!
            </Text>
          </View>
        </View>

        <View style={styles.characterImageContainer}>
          <Wisker source={cameraimg}/>
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

styleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingTop: 20,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        paddingHorizontal: SCREEN_WIDTH * 0.05,
        paddingVertical: SCREEN_WIDTH * 0.02,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 20,
    },
    mainText: {
        color: Colors.wispyWhite,
        fontFamily: Fonts.suitExtraBold,
        fontSize: normalize(16),
        textAlign: 'center',
    },
    characterImageContainer: {
        position: 'absolute',
        bottom: SCREEN_WIDTH * -0.2, // Adjust this value to move the image up or down
        left: SCREEN_WIDTH * -0.2, // Adjust this value to move the image left or right
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
});

export default GenWaitingScreen;