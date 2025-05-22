// components/StepIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

export default function StepIndicator({ text }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
  },
  text: {
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitExtraBold,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
});