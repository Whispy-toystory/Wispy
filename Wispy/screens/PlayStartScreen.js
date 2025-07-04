// PlayStartScreen.js
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import ConfettiCannon from 'react-native-confetti-cannon';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import * as THREE from 'three';

import { PlayContent } from '../components/PlayContent';

import PrimaryButton from '../components/PrimaryButton';
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const designScreenWidth = 375;
const scaleFactor = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

function PlayStartScreen() {
  const userName = 'User Name';
  const characterName = 'Character Name';

  // Confetti
  const [shoot, setShoot] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShoot(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} />
      {/* 레이어 1: 배경 그라데이션 */}
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* 레이어 2: 3D 씬 (화면 전체 차지) */}
      <Canvas
        gl={{ alpha: true }}
        toneMapping={THREE.ACESFilmicToneMapping}
        camera={{ position: [0, 1.5, 6], fov: 50}}
      >
        {/* THREE.Fog(색상, 안개 시작 거리, 안개 끝나는 거리) */}
        <fog attach="fog" args={['rgb(169, 223, 255)', 5, 23]} />
        <Suspense fallback={null}>
          <PlayContent />
        </Suspense>
      </Canvas>
      
      {/* 레이어 3: UI 오버레이 (SafeAreaView 적용) */}
      <SafeAreaView style={styles.uiOverlay}>
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Hi there, ({userName})!{'\n'}
            I'm <Text style={{ color: Colors.wispyYellow }}>({characterName})</Text>,{'\n'}
            your very own magical{'\n'}
            <Text style={{ color: Colors.wispyOrange }}>guardian angel!</Text>{'\n'}
            I'm here just for you!{'\n'}
            Want to be friends?
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={() => console.log('Play button pressed!')}
            backgroundColor={Colors.wispyButtonYellow}
            textColor={Colors.wispyRed}
          >
            Yay! Let's play together!
          </PrimaryButton>
        </View>
      </SafeAreaView>

      {/* 레이어 4: 컨페티 효과 */}
      {shoot && (
        <ConfettiCannon
          key={Math.random()} 
          count={300}
          origin={{ x: SCREEN_WIDTH/2, y: SCREEN_HEIGHT }}
          autoStart={true}
          fadeOut={true}
          explosionSpeed={200}
          fallSpeed={3000}
          colors={['rgb(252, 113, 136)', 'rgb(174, 241, 165)', 'rgb(131, 193, 255)', 'rgb(255, 248, 151)']}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  uiOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  textContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(26),
    lineHeight: normalize(40),
    fontFamily: Fonts.suitHeavy,
  },
  subText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(22),
    lineHeight: normalize(32),
    fontFamily: Fonts.suitHeavy,
    marginTop: 20,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
});

export default PlayStartScreen;