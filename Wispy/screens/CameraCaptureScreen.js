// screens/CameraCaptureScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Platform, Image, PixelRatio } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Fonts from '../constants/fonts';
import Colors from '../constants/colors';

const DEFAULT_CHARACTER_IMAGE = require('../assets/images/Wisker.png');

// 하위 컴포넌트
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

// 촬영 단계를 정의합니다.
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
  const [isCapturingVisual, setIsCapturingVisual] = useState(false); // UI 비활성화 및 버튼 disabled 상태용
  const isActuallyCapturing = useRef(false); // 실제 촬영 중인지 즉각적인 확인용 ref
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

  useEffect(() => {
    (async () => {
      if (!permission || !permission.canAskAgain || permission.granted) return;
      const { status } = await requestPermission();
      if (status !== 'granted') Alert.alert('Permission Denied', 'Camera permission is required.');
    })();
  }, [permission, requestPermission]);

  const handleTakePicture = async () => {
    const currentStepInfo = STEP_DETAILS[currentStep];
    if (currentStep === CAPTURE_STEPS.READY) {
      if (currentStepInfo.nextStep) setCurrentStep(currentStepInfo.nextStep);
      return;
    }
    if (currentStep === CAPTURE_STEPS.REVIEW) {
      if (currentStepInfo.nextStep) setCurrentStep(currentStepInfo.nextStep);
      console.log('Review complete:', capturedImages);
      return;
    }
    if (currentStep === CAPTURE_STEPS.DONE) {
      setCurrentStep(CAPTURE_STEPS.READY);
      setCapturedImages({
        FRONT: null,
        RIGHT: null,
        LEFT: null,
        BACK: null,
      });
      return;
    }
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      setCapturedImages(prev => ({ ...prev, [currentStep]: photo.uri }));
      if (currentStepInfo.nextStep) setCurrentStep(currentStepInfo.nextStep);
      else setCurrentStep(CAPTURE_STEPS.DONE);
    } catch (error) {
      console.error('Pic error:', error);
      Alert.alert('Error', 'Could not take pic.');
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

  const handleReviewDone = () => {
    setCurrentStep(CAPTURE_STEPS.DONE);
    console.log('Review complete. Final images:', capturedImages);
  };

  const lastPressTime = useRef(0);


  const handleMainButtonPress = async () => {
    if (isActuallyCapturing.current) {
      console.log("handleMainButtonPress: Capture already in progress. Ignoring.");
      return;
    }

    // 2. 즉시 실제 촬영 플래그를 true로 설정하여 중복 진입 방지
    isActuallyCapturing.current = true;
    // 3. 시각적 피드백을 위해 상태 업데이트 (버튼 비활성화 등)
    setIsCapturingVisual(true);

    lastPressTime.current = now;
    setIsCapturingVisual(true);

    const currentStepInfo = STEP_DETAILS[currentStep];

    if (currentStep === CAPTURE_STEPS.READY) {
      if (currentStepInfo.nextStep) {
        setCurrentStep(currentStepInfo.nextStep);
      }
      isActuallyCapturing.current = false;
      setIsCapturingVisual(false);
      return;
    }

    if (currentStep === CAPTURE_STEPS.REVIEW || currentStep === CAPTURE_STEPS.DONE) {
        // console.log(`handleMainButtonPress: Called on ${currentStep} step, exiting. Resetting flags.`);
      isActuallyCapturing.current = false;
      setIsCapturingVisual(false);
      return;
    }
    
    if (!cameraRef.current) {
      console.error("handleMainButtonPress: Camera ref is not set. Resetting flags.");
      Alert.alert('Error', 'Camera not ready.');
      isActuallyCapturing.current = false;
      setIsCapturingVisual(false);
      return;
    }


    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      console.log('Picture taken:', photo.uri ? 'Success' : 'Failed or no URI');
      
      if (photo && photo.uri) {
        setCapturedImages(prev => {
          const newImages = { ...prev, [currentStep]: photo.uri };
          // console.log("handleMainButtonPress: Captured images updated:", newImages);
          return newImages;
        });
        if (currentStepInfo.nextStep) {
          setCurrentStep(currentStepInfo.nextStep);
        } else {
          setCurrentStep(CAPTURE_STEPS.REVIEW);
        }
      } else {
        Alert.alert('Capture Error', 'Failed to get image URI.');
      }
    } catch (error) {
      console.error('Pic error:', error);
      Alert.alert('Error', `Failed to capture image: ${error.message}`);
    } finally {
      console.log('Finishing capture process, resetting flags.');
      isActuallyCapturing.current = false;
      setIsCapturingVisual(false);
    }
  };

  if (!permission)
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: Fonts.suitBold }}>Requesting permission...</Text>
      </View>
    );
  if (!permission.granted)
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: Fonts.suitBold }}>No camera access.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.utilityButton}>
          <Text style={styles.utilityButtonText}>Grant</Text>
        </TouchableOpacity>
      </View>
    );

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
                onPress={() => console.log('Next')}
                style={[styles.utilityButton, styles.reviewButton, styles.okButton]}
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
                  <CaptureButton onPress={handleTakePicture} title="OK" />
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
                    style={styles.iconButton}
                    disabled={isCapturingVisual}
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
                      color="white"
                    />
                  </TouchableOpacity>
                  <CaptureButton onPress={handleTakePicture} disabled={isCapturingVisual} />
                  <TouchableOpacity
                    onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))}
                    style={styles.iconButton}
                    disabled={isCapturingVisual}
                  >
                    <Ionicons name="camera-reverse-outline" size={36} color={isCapturingVisual ? "grey" : "white"} />
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
    backgroundColor: Colors.wispyWhite
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
    minHeight: windowHeight * 0.3,
    zIndex: 5,
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
  iconButton: { padding: 10, justifyContent: 'center', alignItems: 'center' },
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
    color: 'white',
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
});