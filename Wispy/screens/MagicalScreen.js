import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

function MagicalScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.mainText}> Something magical{'\n'}is about to happen~ </Text>
            <Text style={styles.mainText}> 
                <Text style={styles.subText}> Good luck </Text>on your{'\n'}Wispy adventure!
            </Text>

        </View>
    );
}

export default MagicalScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
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
});