// screens/CameraCaptureScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Platform, Image } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_CHARACTER_IMAGE = require('../assets/images/Wisker.png'); // 캐릭터 이미지

// 하위 컴포넌트
import StepIndicator from '../components/StepIndicator';
import GuidelineOverlay from '../components/GuidelineOverlay';
import InstructionText from '../components/InstructionText';
import CaptureButton from '../components/CaptureButton';
import FramedImagePreview from '../components/FramedImagePreview';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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
        indicatorText: '', // READY 단계에서는 상단 인디케이터 비움
        instruction: "Let's follow the guide! Take a picture from the front, back, right, and left!",
        guidelineType: null,
        nextStep: CAPTURE_STEPS.FRONT,
        characterImage: DEFAULT_CHARACTER_IMAGE,
    },
    [CAPTURE_STEPS.FRONT]: {
        id: CAPTURE_STEPS.FRONT,
        indicatorText: 'FRONT',
        instruction: "Great! Now, take a picture from the front!",
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
        nextStep: null, // 마지막 단계
        characterImage: DEFAULT_CHARACTER_IMAGE,
    }
};

export default function CameraCaptureScreen() {
    const insets = useSafeAreaInsets();
    // ... (useState, useEffect, handleTakePicture 함수 등은 이전 답변과 동일하게 유지)
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
        setCurrentStep(CAPTURE_STEPS.READY); // 처음 READY 단계로 돌아감
    };

    const handleReviewDone = () => {
        setCurrentStep(CAPTURE_STEPS.DONE);
        console.log('Review complete. Final images:', capturedImages);
        // DONE 단계에서 최종 완료 메시지 표시됨
    };

    const handleMainButtonPress = async () => {
        const currentStepInfo = STEP_DETAILS[currentStep];

        if (currentStep === CAPTURE_STEPS.READY) {
        if (currentStepInfo.nextStep) setCurrentStep(currentStepInfo.nextStep);
        return;
        }
        // REVIEW, DONE 단계의 버튼 액션은 각 버튼에 직접 연결하므로 여기서 처리 안 함

        if (!cameraRef.current || currentStep === CAPTURE_STEPS.REVIEW || currentStep === CAPTURE_STEPS.DONE) return;

        try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setCapturedImages(prev => ({ ...prev, [currentStep]: photo.uri }));
        if (currentStepInfo.nextStep) setCurrentStep(currentStepInfo.nextStep);
        else setCurrentStep(CAPTURE_STEPS.REVIEW); // 모든 촬영 후 기본적으로 REVIEW로
        } catch (error) {
        console.error('Pic error:', error);
        Alert.alert('Error', 'Could not take pic.');
        }
    };

    // --- "다시 찍기"를 위한 함수 ---

    if (!permission) return <View style={styles.centered}><Text>Requesting permission...</Text></View>;
    if (!permission.granted) return (
        <View style={styles.centered}>
            <Text>No camera access.</Text>
            <TouchableOpacity onPress={requestPermission} style={styles.utilityButton}>
                <Text style={styles.utilityButtonText}>Grant</Text>
            </TouchableOpacity>
        </View>
    );

  const currentStepInfo = STEP_DETAILS[currentStep];

  // REVIEW 단계 UI 수정
  if (currentStep === CAPTURE_STEPS.REVIEW) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.reviewScreenContainerStyle, { paddingTop: 10, paddingBottom: 10 }]}>
          {/* 상단 StepIndicator는 조건부로 렌더링 (여기서는 비워둠) */}
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
                    containerWidth={(windowWidth - (styles.reviewScreenContainerStyle.paddingHorizontal || 0) * 2 - 20) / 2} // 20은 아이템간 총 마진
                  />
                );
              }
              return null;
            })}
          </View>
          <View style={[styles.reviewActionButtonsContainer, { paddingBottom: 15 + insets.bottom }]}>
            {/* paddingBottom은 Safe Area inset에 추가적인 여유 공간을 더해줍니다. */}
            {/* 이 부분은 인라인 스타일에서 insets.bottom을 직접 사용하는 것이 더 정확합니다. */}
            {/* 예: paddingBottom: 15 + insets.bottom */}
            <TouchableOpacity onPress={handleFullRetake} style={[styles.utilityButton, styles.reviewButton]}>
              <Text style={styles.utilityButtonText}>Retake All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Next')} style={[styles.utilityButton, styles.reviewButton, styles.okButton]}>
              <Text style={styles.utilityButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (currentStep === CAPTURE_STEPS.DONE) {
    // ...existing code...
    return (
      <View style={[styles.centered, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StepIndicator text={currentStepInfo.indicatorText} />
        <InstructionText text={currentStepInfo.instruction} characterImageSource={currentStepInfo.characterImage} />
        <TouchableOpacity onPress={handleTakePicture} style={styles.utilityButton}>
          <Text style={styles.utilityButtonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- 촬영 단계 UI ---

  return (
    <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.cameraAreaContainer}>
            <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef} />

            {/* 오버레이 전체 컨테이너: Safe Area 패딩 적용 */}
            <View style={[
                styles.overlayContainer,
                { paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }
            ]}>
                {/* 1. 상단 컨트롤 (StepIndicator) */}
                <View style={styles.topControlsArea}>
                    {currentStepInfo.indicatorText && <StepIndicator text={currentStepInfo.indicatorText} />}
                </View>

                {/* 2. 중앙 가이드라인 영역 (남은 공간 차지) */}
                <View style={styles.guidelineArea}>
                    <GuidelineOverlay type={currentStepInfo.guidelineType} />
                </View>

                {/* 3. 하단 UI 그룹 (캐릭터 말풍선 + 버튼 박스) */}
                {/* 이 그룹은 overlayContainer의 하단에 위치 (marginTop: 'auto' 사용) */}
                <View style={styles.bottomUIGroupContainer}>
                    {/* 3.1 캐릭터 말풍선 안내 영역 */}
                    <View style={styles.instructionWrapper}>
                        <InstructionText
                            text={currentStepInfo.instruction}
                            characterImageSource={currentStepInfo.characterImage}
                        />
                    </View>

                    {/* 3.2 최하단 버튼 컨트롤 영역 */}
                    <View style={[
                        styles.bottomButtonControlsWrapper,
                        { paddingBottom: insets.bottom + 25 } // 하단 Safe Area + 추가 여백
                    ]}>
                    {currentStep === CAPTURE_STEPS.READY ? (
                        <View style={styles.actionButtonsRowReady}>
                        <   CaptureButton onPress={handleTakePicture} title="OK" />
                        </View>
                    ) : (
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity
                                onPress={() => setFlash(c => (c === 'off' ? 'on' : (c === 'on' ? 'auto' : 'off')))}
                                style={styles.iconButton}
                            >
                                <Ionicons
                                name={flash === 'on' ? 'flash' : (flash === 'auto' ? 'flash-outline' : 'flash-off-outline')}
                                size={30}
                                color="white"
                                />
                            </TouchableOpacity>
                            <CaptureButton onPress={handleTakePicture} />
                            <TouchableOpacity
                                onPress={() => setFacing(c => (c === 'back' ? 'front' : 'back'))}
                                style={styles.iconButton}
                            >
                                <Ionicons name="camera-reverse-outline" size={36} color="white" />
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
  container: { flex: 1, backgroundColor: 'black' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f8f8f8' },
  cameraAreaContainer: { flex: 1, position: 'relative' },
  camera: { ...StyleSheet.absoluteFillObject },
  overlayContainer: {
    flex: 1,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  topControlsArea: {
    // height: 50, // 내용에 따라 자동
    alignItems: 'center',
    paddingTop: 15, // Safe Area 상단 inset 이후의 추가 여백
  },
  guidelineArea: {
    flex: 1, // 상단과 하단 UI 그룹을 제외한 모든 공간 차지
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    // backgroundColor: 'rgba(0,255,0,0.05)', // 영역 확인용
  },
  bottomUIGroupContainer: {
    marginTop: 'auto', // 이 그룹을 overlayContainer의 하단으로 밀어냄
  },
  instructionWrapper: {
    // position: 'absolute', // bottomUIGroupContainer 내에서 위치 잡으므로 제거 가능
    width: '100%',
    alignItems: 'center',
    zIndex: 10,
    marginBottom: -35,
  },
  bottomButtonControlsWrapper: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingTop: 35,      // 버튼과 박스 상단 경계 사이 여백 증가 (높이 키우기)
    // paddingBottom은 인라인으로 Safe Area inset + 추가 여백 적용 (예: insets.bottom + 30)
    minHeight: windowHeight * 0.3,      // 최소 높이 (기존 80에서 증가)
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
  // --- REVIEW 화면 스타일 ---
  reviewScreenContainerStyle: { // REVIEW 화면 전체 컨테이너 (이름 변경)
    flex: 1,
    justifyContent: 'space-between', // 말풍선, 이미지 그리드, 버튼 영역 배분
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10, // 전체 좌우 패딩
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
    // backgroundColor: 'rgba(0,255,0,0.1)', // 영역 확인용
  },
  reviewActionButtonsContainer: { // REVIEW 화면 하단 버튼 컨테이너
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 5, // 버튼 위아래 여백
    marginTop: 'auto',
  },
  utilityButton: {
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#007AFF',
    borderRadius: 8
  },
  utilityButtonText: { color: 'white', fontSize: 16, fontWeight: '500', },
  reviewButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 15,
  },
  okButton: {
    backgroundColor: '#4CAF50',
  },
});