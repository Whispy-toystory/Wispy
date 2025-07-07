import React, { Suspense, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas } from '@react-three/fiber/native';
import LottieView from 'lottie-react-native'; // Lottie import

import { PlayContentWithCallback } from '../components/PlayContent';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

function ChatLoadingScreen() {
  const navigation = useNavigation();

  const onWarmedUp = useCallback(() => {
    navigation.replace('Chat');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.wispyPink, Colors.wispyBlue]} style={StyleSheet.absoluteFill} />
      
      <LottieView
        source={require('../assets/images/loading.json')}
        style={styles.lottie}
        autoPlay
        loop
      />
      
      <Text style={styles.loadingText}>
        It's time to play!
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
    lottie: {
      width: 250,
      height: 250,
    },
    loadingText: {
      marginTop: 20,
      fontSize: 20,
      fontFamily: Fonts.suitHeavy,
      color: Colors.wispyWhite,
      textAlign: 'center',
    },
    hiddenCanvasContainer: {
      position: 'absolute',
      width: 1,
      height: 1,
      top: -10,
      left: -10,
    }
});

export default ChatLoadingScreen;