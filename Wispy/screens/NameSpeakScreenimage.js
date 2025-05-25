// NameSpeakScreen.js
import React, { useRef } from 'react'; // Added useRef
import {
  View,
  Text,
  StyleSheet,
  Image,
  // TouchableOpacity, // Replaced with Pressable for better animation control
  Dimensions,
  Platform,
  PixelRatio,
  Animated, // Added Animated
  Pressable // Added Pressable
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker'; // Added Wisker import

// normalize function (copied from GenWaitingScreen.js)
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scaleFactor = SCREEN_WIDTH / designScreenWidth; // Renamed 'scale' to 'scaleFactor' to avoid conflict

export function normalize(size) {
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// Image assets
const guardianimg = require('../assets/images/angelguardian.png'); // Added guardianimg [fileName: GenWaitingScreen.js]
const talkingFlowerImg = require('../assets/images/talking_flower.png');

function NameSpeakScreen({ navigation }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleFlowerPress = () => {
    console.log('Talking flower action triggered (e.g., start STT).');
    // This is where you'd eventually put the logic for "delivering the speech"
  };

  const onPressInFlower = () => {
    Animated.spring(scaleValue, {
      toValue: 0.85, // Scale down slightly
      useNativeDriver: true,
      friction: 4, // Adjust for bounciness
      tension: 60,
    }).start();
  };

  const onPressOutFlower = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3, // Lower friction for more bounce on return
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <SubAppLogo />
        </View>

        <View style={styles.instructionTextContainer}>
          <Text style={styles.mainText}>
            Wow! Almost ready!{'\n'}
            Now call your guardian angel's{'\n'}
            name 5 times to the talking flower!{'\n'}
            Then.. your angel will wake up!
          </Text>
        </View>

        <View style={styles.characterImageContainer}>
          <Wisker source={guardianimg} style ={{    // iOS Shadow
            shadowColor: '#00ff00', // 원하는 광선 색상
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 20, // 광선이 퍼지는 범위
            // Android Shadow
            elevation: 20,
          }}/>
        </View>

        {/* Interactive area for speech bubble and talking flower */}
        <View style={styles.interactiveFlowerArea}>
          <View style={styles.speechBubbleWrapper}>
            <View style={styles.speechBubbleContent}>
              <Text style={styles.speechBubbleText}>
                This is a magical talking flower! {'\n'}
                If you whisper to it, your special friend will hear your words
              </Text>
            </View>
            <View style={styles.speechBubblePointer} />
          </View>

          <Pressable
            onPress={handleFlowerPress} // Action on full press (tap)
            onPressIn={onPressInFlower}  // Animation starts on press down
            onPressOut={onPressOutFlower} // Animation reverses on press release
            style={styles.flowerTouchable}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              {/* For GLB: Replace Image with your 3D model component here, wrapped by Animated.View */}
              <Image source={talkingFlowerImg} style={styles.flowerImageStyle} />
            </Animated.View>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flex: 0.1, // Adjusted flex
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
  },
  instructionTextContainer: {
    flex: 0.7, // Adjusted flex
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: normalize(20),
    lineHeight: normalize(36),
    fontFamily: Fonts.suitHeavy,
  },
  characterImageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: normalize(80), // Added vertical margin for spacing
  },
  interactiveFlowerArea: { // For speech bubble and flower
    flex: 0.6, // Adjusted flex, more space for interactive elements + angel
    justifyContent: 'center', // Center bubble and flower vertically in this area
    alignItems: 'center', // Center bubble and flower horizontally
    paddingBottom: normalize(10),
  },
  speechBubbleWrapper: {
    alignItems: 'center',
    marginBottom: -normalize(20),
  },
  speechBubbleContent: {
    backgroundColor: Colors.wispyButtonYellow, // [fileName: 스크린샷 2025-05-25 140706.jpg]
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(12),
    borderRadius: normalize(15),
    maxWidth: '90%',
  },
  speechBubbleText: {
    textAlign: 'center',
    color: Colors.wispyTextBlue, 
    fontSize: normalize(15),
    fontFamily: Fonts.suitHeavy, // Consider Fonts.suitMedium or similar if available
    lineHeight: normalize(20),
  },
  speechBubblePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(10),
    borderRightWidth: normalize(10),
    borderTopWidth: normalize(15),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.wispyButtonYellow, 
    alignSelf: 'center',
  },
  flowerTouchable: {
     // Pressable itself doesn't need much styling if Animated.View handles visuals
    marginTop: normalize(15), // Increased space between bubble and flower
  },
  flowerImageStyle: {
    width: normalize(150), // Adjusted size for better visibility
    height: normalize(150), // Adjusted size for better visibility
  },
});

export default NameSpeakScreen;