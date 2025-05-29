// CameraSetScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, PixelRatio } from 'react-native';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// utils/normalizeText.js
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


const cameraimg = require('../assets/images/Camera.png');
 
function CamReadyScreen() {

    return (
        <View
            style={styles.bakcgroundContainer}
        >
            <SafeAreaView style={styles.safeArea}>

                <View style={[styles.headerContainer]}>
                    {/*<SubAppLogo />*/}
                </View>

                <View style={styles.contentContainer}>
                    <View style={styles.textcontainer}>
                        <Text style={styles.mainText}>
                            First, {'\n'}
                            please find{'\n'}
                            your most <Text style={{color:Colors.wispyYellow}}>favorite toy</Text>{'\n'}
                            and hold it close...
                        </Text>
                    </View>
                </View>

                <View style={styles.characterImageContainer}>
                    <Wisker source={cameraimg}/>
                </View>

                <View style={styles.inputContainer}>
                    <PrimaryButton title="Start Camera" 
                    onPress={() => console.log('Next')}
                    textColor={Colors.wispyRed}>Ready? Let's take a photo!</PrimaryButton>
                </View>
            </SafeAreaView>
            
        </View>
    );
}

const styles = StyleSheet.create({
    bakcgroundContainer: {
        flex: 1,
        backgroundColor: Colors.wispyBlack,
    },
    safeArea: {
        flex: 1,
    },
    headerContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 0.2,
        paddingHorizontal: 15,
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
    characterImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1.2,
    },
  inputContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});


export default CamReadyScreen;