// screens/CameraScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Platform, Image, PixelRatio } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';

const DEFAULT_CHARACTER_IMAGE = require('../assets/images/Wisker.png');

import PrimaryButton from '../components/PrimaryButton';
import StepIndicator from '../components/StepIndicator';
import GuidelineOverlay from '../components/GuidelineOverlay';
import InstructionText from '../components/InstructionText';
import CaptureButton from '../components/CaptureButton';
import FramedImagePreview from '../components/FramedImagePreview';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

// 촬영 단계
const CAPTURE_STEPS = {
  READY: 'READY',
  FRONT: 'FRONT',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
  BACK: 'BACK',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
};

const STEP_DETAILS = {
  [CAPTURE_STEPS.READY]: {
    id: CAPTURE_STEPS.READY,
    indicatorText: '',
    instruction: "Let's follow the guide! Take a picture from the front, back, right, and left!",
    guidelineType: null,
    nextStep: CAPTURE_STEPS.FRONT,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  },
  [CAPTURE_STEPS.FRONT]: {
    id: CAPTURE_STEPS.FRONT,
    indicatorText: 'FRONT',
    instruction: "Now, take a picture from the front!",
    guidelineType: 'front',
    nextStep: CAPTURE_STEPS.RIGHT,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  },
  [CAPTURE_STEPS.RIGHT]: {
    id: CAPTURE_STEPS.RIGHT,
    indicatorText: 'RIGHT',
    instruction: 'Good job! Next, the right side.',
    guidelineType: 'side_right',
    nextStep: CAPTURE_STEPS.LEFT,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  },
  [CAPTURE_STEPS.LEFT]: {
    id: CAPTURE_STEPS.LEFT,
    indicatorText: 'LEFT',
    instruction: 'Almost there! Take a picture from the left side.',
    guidelineType: 'side_left',
    nextStep: CAPTURE_STEPS.BACK,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  },
  [CAPTURE_STEPS.BACK]: {
    id: CAPTURE_STEPS.BACK,
    indicatorText: 'BACK',
    instruction: 'Finally, please take a picture of the back side.',
    guidelineType: 'back',
    nextStep: CAPTURE_STEPS.REVIEW,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  },
  [CAPTURE_STEPS.REVIEW]: {
    id: CAPTURE_STEPS.REVIEW,
    indicatorText: 'REVIEW',
    instruction: 'All photos taken! Please review them.',
    guidelineType: null,
    nextStep: CAPTURE_STEPS.DONE,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  },
  [CAPTURE_STEPS.DONE]: {
    id: CAPTURE_STEPS.DONE,
    indicatorText: 'COMPLETED',
    instruction: 'Thank you! All captures are complete!',
    guidelineType: null,
    nextStep: null,
    characterImage: DEFAULT_CHARACTER_IMAGE,
  }
};

export default function CameraCaptureScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [currentStep, setCurrentStep] = useState(CAPTURE_STEPS.READY);
  const [capturedImages, setCapturedImages] = useState({
    [CAPTURE_STEPS.FRONT]: null,
    [CAPTURE_STEPS.RIGHT]: null,
    [CAPTURE_STEPS.LEFT]: null,
    [CAPTURE_STEPS.BACK]: null,
  });
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  
  // 촬영 중 상태 관리
  const [isCapturing, setIsCapturing] = useState(false);
  const isCapturingRef = useRef(false);

  const handleMainButtonPress = async () => {
    if (isCapturingRef.current) {
      console.log("Already capturing, ignoring button press");
      return;
    }

    // 즉시 촬영 상태로 설정
    isCapturingRef.current = true;
    setIsCapturing(true);

    const currentStepInfo = STEP_DETAILS[currentStep];

    try {
      // READY 단계: 바로 다음 단계로 이동
      if (currentStep === CAPTURE_STEPS.READY) {
        if (currentStepInfo.nextStep) {
          setCurrentStep(currentStepInfo.nextStep);
        }
        return;
      }

      // REVIEW 단계: OK 버튼 누르면 완료
      if (currentStep === CAPTURE_STEPS.REVIEW) {
        console.log('Review complete:', capturedImages);
        navigation.navigate('GenWaiting');
      }

      // DONE 단계: 처음으로 돌아가기
      if (currentStep === CAPTURE_STEPS.DONE) {
        setCurrentStep(CAPTURE_STEPS.READY);
        setCapturedImages({
          [CAPTURE_STEPS.FRONT]: null,
          [CAPTURE_STEPS.RIGHT]: null,
          [CAPTURE_STEPS.LEFT]: null,
          [CAPTURE_STEPS.BACK]: null,
        });
        return;
      }

      // 촬영 단계들 (FRONT, RIGHT, LEFT, BACK)
      if (!cameraRef.current) {
        console.log("No camera ref available");
        return;
      }

      if (capturedImages[currentStep]) {
        console.log(`Already captured image for ${currentStep}, moving to next step`);
        if (currentStepInfo.nextStep) {
          setCurrentStep(currentStepInfo.nextStep);
        }
        return;
      }

      // 실제 촬영
      console.log(`Taking picture for step: ${currentStep}`);
      const photo = await cameraRef.current.takePictureAsync({ 
        quality: 0.7,
        skipProcessing: true, // 처리 속도 향상
      });

      if (photo.uri) {
        // 이미지 저장
        setCapturedImages(prev => ({ ...prev, [currentStep]: photo.uri }));
        
        setTimeout(() => {
          if (currentStepInfo.nextStep) {
            setCurrentStep(currentStepInfo.nextStep);
          }
        }, 300); // 짧은 딜레이로 사용자에게 촬영 완료 피드백 제공
      } else {
        Alert.alert('Capture Error', 'Failed to capture image.');
      }

    } catch (error) {
      console.error(`Error during capture: ${error.message}`);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      // 촬영 완료 후 상태 초기화
      setTimeout(() => {
        isCapturingRef.current = false;
        setIsCapturing(false);
      }, 500); // 버튼 연타 방지를 위한 짧은 딜레이
    }
  };

  const handleFullRetake = () => {
    setCapturedImages({
      [CAPTURE_STEPS.FRONT]: null,
      [CAPTURE_STEPS.RIGHT]: null,
      [CAPTURE_STEPS.LEFT]: null,
      [CAPTURE_STEPS.BACK]: null,
    });
    setCurrentStep(CAPTURE_STEPS.READY);
  };

  if (!permission || !isFocused)
    return (
      <View style={styles.centered} />
    );
  if (!permission.granted){
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>
          To take photos, you need to allow camera access.
        </Text>
        <PrimaryButton
          onPress={requestPermission}
          textColor={Colors.wispyTextBlue}
        >
          Allow Camera
        </PrimaryButton>
      </View>
    );
  }

  const currentStepInfo = STEP_DETAILS[currentStep];

  // REVIEW 단계 UI
  if (currentStep === CAPTURE_STEPS.REVIEW) {
    return (
      <LinearGradient
        colors={[Colors.wispyPink, Colors.wispyBlue]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.reviewScreenContainerStyle, { paddingTop: 10, paddingBottom: 10 }]}>
            <InstructionText
              text={currentStepInfo.instruction}
              characterImageSource={currentStepInfo.characterImage}
            />
            <View style={styles.previewImageGridContainer}>
              {Object.entries(capturedImages).map(([stepKey, uri]) => {
                if (uri && STEP_DETAILS[stepKey] && STEP_DETAILS[stepKey].guidelineType !== null) {
                  return (
                    <FramedImagePreview
                      key={stepKey}
                      imageUri={uri}
                      label={STEP_DETAILS[stepKey].indicatorText || stepKey}
                      containerWidth={
                        (windowWidth - (styles.reviewScreenContainerStyle.paddingHorizontal || 0) * 2 - 20) / 2
                      }
                    />
                  );
                }
                return null;
              })}
            </View>
            <View style={[styles.reviewActionButtonsContainer, { paddingBottom: 15 + insets.bottom }]}>
              <TouchableOpacity onPress={handleFullRetake} style={[styles.utilityButton, styles.reviewButton]}>
                <Text style={[styles.utilityButtonText, { color: Colors.wispyRed }]}>Retake All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleMainButtonPress}
                style={[styles.utilityButton, styles.reviewButton, styles.okButton]}
                disabled={isCapturing}
              >
                <Text style={[styles.utilityButtonText, { color: Colors.wispyTextBlue }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // 촬영 단계 UI
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.cameraAreaContainer}>
        <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef} />
        <View
          style={[
            styles.overlayContainer,
            { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }
          ]}
        >
          {/* 1. 상단 컨트롤 (StepIndicator) */}
          <View style={styles.topControlsArea}>
            {currentStepInfo.indicatorText && <StepIndicator text={currentStepInfo.indicatorText} />}
          </View>
          {/* 2. 중앙 가이드라인 영역 */}
          <View style={styles.guidelineArea}>
            <GuidelineOverlay type={currentStepInfo.guidelineType} />
          </View>
          {/* 3. 하단 UI 그룹 */}
          <View style={styles.bottomUIGroupContainer}>
            {/* 3.1 캐릭터 말풍선 안내 영역 */}
            <View style={styles.instructionWrapper}>
              <InstructionText
                text={currentStepInfo.instruction}
                characterImageSource={currentStepInfo.characterImage}
              />
            </View>
            {/* 3.2 최하단 버튼 컨트롤 영역 */}
            <View
              style={[
                styles.bottomButtonControlsWrapper,
                { paddingBottom: insets.bottom + 25 }
              ]}
            >
              {currentStep === CAPTURE_STEPS.READY ? (
                <View style={styles.actionButtonsRowReady}>
                  <CaptureButton 
                    onPress={handleMainButtonPress} 
                    title="OK" 
                    disabled={isCapturing}
                  />
                </View>
              ) : (
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    onPress={() =>
                      setFlash(c =>
                        c === 'off'
                          ? 'on'
                          : c === 'on'
                          ? 'auto'
                          : 'off'
                      )
                    }
                    style={[styles.iconButton, isCapturing && styles.disabledIconButton]}
                    disabled={isCapturing}
                  >
                    <Ionicons
                      name={
                        flash === 'on'
                          ? 'flash'
                          : flash === 'auto'
                          ? 'flash-outline'
                          : 'flash-off-outline'
                      }
                      size={30}
                      color={isCapturing ? "#666" : "white"}
                    />
                  </TouchableOpacity>
                  <CaptureButton 
                    onPress={handleMainButtonPress} 
                    disabled={isCapturing}
                  />
                  <TouchableOpacity
                    onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))}
                    style={[styles.iconButton, isCapturing && styles.disabledIconButton]}
                    disabled={isCapturing}
                  >
                    <Ionicons 
                      name="camera-reverse-outline" 
                      size={36} 
                      color={isCapturing ? "#666" : "white"} 
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.wispyBlack },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.wispyBlack
  },
  cameraAreaContainer: { flex: 1, position: 'relative' },
  camera: { ...StyleSheet.absoluteFillObject },
  overlayContainer: {
    flex: 1,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  topControlsArea: {
    alignItems: 'center',
    paddingTop: 15,
  },
  guidelineArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomUIGroupContainer: {
    marginTop: 'auto',
  },
  instructionWrapper: {
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: -35,
  },
  bottomButtonControlsWrapper: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingTop: 35,
    bottom: -10,
    minHeight: windowHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  actionButtonsRowReady: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: { 
    padding: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  disabledIconButton: {
    opacity: 0.5,
  },
  reviewScreenContainerStyle: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  reviewTopSpace: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 15,
    width: '100%',
  },
  reviewActionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5,
    marginTop: 'auto',
  },
  utilityButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: Colors.wispyGrey,
    borderRadius: 8
  },
  utilityButtonText: {
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitHeavy,
    fontSize: normalize(22),
    fontWeight: '500',
  },
  reviewButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 15,
  },
  okButton: {
    backgroundColor: Colors.wispyButtonYellow,
  },
  permissionText: {
    fontFamily: Fonts.suitHeavy,
    color: Colors.wispyWhite,
    fontSize: normalize(18),
    textAlign: 'center',
    marginBottom: 20,
  },
});