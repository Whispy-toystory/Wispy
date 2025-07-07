import React, { Suspense, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas } from '@react-three/fiber/native';
import LottieView from 'lottie-react-native';

import { PlayContentWithCallback } from '../components/PlayContent';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

function PlayStartLoadingScreen() {
  const navigation = useNavigation();

  const onWarmedUp = useCallback(() => {
    navigation.replace('PlayStart');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.wispyPink, Colors.wispyBlue]} style={StyleSheet.absoluteFill} />
      
      <View style={styles.loadingContainer}>
        {/*Lottie 애니메이션 */}
        <LottieView
          source={require('../assets/images/loading.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
      </View>
      
      <Text style={styles.loadingText}>
        Ready to meet {'\n'} your new special guardian angel?
      </Text>

      <View style={styles.hiddenCanvasContainer} pointerEvents="none">
        <Canvas>
          <Suspense fallback={null}>
            <PlayContentWithCallback isAnimated={false} onLoaded={onWarmedUp} />
          </Suspense>
        </Canvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingContainer: {
      width: 250,
      height: 250,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    lottie: {
      width: 200,
      height: 200,
      position: 'absolute',
    },
    loadingText: {
      fontSize: 20,
      fontFamily: Fonts.suitHeavy,
      color: Colors.wispyWhite,
      textAlign: 'center',
      lineHeight: 24,
    },
    hiddenCanvasContainer: {
      position: 'absolute',
      width: 1,
      height: 1,
      top: -10,
      left: -10,
    }
});

export default PlayStartLoadingScreen;