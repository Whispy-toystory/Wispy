// screens/CameraCaptureScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

console.log('Imported CameraType:', CameraType);

// 하위 컴포넌트
import StepIndicator from '../components/StepIndicator';
import GuidelineOverlay from '../components/GuidelineOverlay';
import InstructionText from '../components/InstructionText';
import CaptureButton from '../components/CaptureButton';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

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
        indicatorText: 'READY',
        instruction: "Let's follow the guide! Take a picture from the front, back, right, and left!",
        guidelineType: null,
        nextStep: CAPTURE_STEPS.FRONT,
    },
    [CAPTURE_STEPS.FRONT]: {
        id: CAPTURE_STEPS.FRONT,
        indicatorText: 'FRONT',
        instruction: "Let's follow the guide! Take a picture from the front!",
        guidelineType: 'front',
        nextStep: CAPTURE_STEPS.RIGHT,
    },
    [CAPTURE_STEPS.RIGHT]: {
        id: CAPTURE_STEPS.RIGHT,
        indicatorText: 'RIGHT',
        instruction: 'Great! Now, take a picture from the right side.',
        guidelineType: 'side_right',
        nextStep: CAPTURE_STEPS.LEFT,
    },
    [CAPTURE_STEPS.LEFT]: {
        id: CAPTURE_STEPS.LEFT,
        indicatorText: 'LEFT',
        instruction: 'Almost there! Take a picture from the left side.',
        guidelineType: 'side_left',
        nextStep: CAPTURE_STEPS.BACK,
    },
    [CAPTURE_STEPS.BACK]: {
        id: CAPTURE_STEPS.BACK,
        indicatorText: 'BACK',
        instruction: 'Finally, please take a picture of the back side.',
        guidelineType: 'back',
        nextStep: CAPTURE_STEPS.REVIEW, // 뒷면 촬영 후 검토 단계로 이동
    },
    [CAPTURE_STEPS.REVIEW]: {
        id: CAPTURE_STEPS.REVIEW,
        indicatorText: 'REVIEW',
        instruction: 'All photos taken! Please review your photos.',
        guidelineType: null,
        nextStep: CAPTURE_STEPS.DONE,
    },
    [CAPTURE_STEPS.DONE]: {
        id: CAPTURE_STEPS.DONE,
        indicatorText: 'COMPLETED',
        instruction: 'Thank you! All captures are complete.',
        guidelineType: null,
        nextStep: null,
    }
};

export default function CameraCaptureScreen() {
    const insets = useSafeAreaInsets()

    const [hasPermission, setHasPermission] = useState(null);
    const [facing, setFacing] = useState('back'); // 'back' 또는 'front' 문자열 사용
    const [flash, setFlash] = useState('off'); // 예시: 플래시 상태 추가 (문자열: 'on', 'off', 'auto')
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
        // 권한 요청 로직은 useCameraPermissions 훅을 사용하도록 수정하는 것이 좋습니다.
        (async () => {
        const { status } = await requestPermission(); // useCameraPermissions 훅 사용
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera permission is required to use this feature.');
        }
        })();
    }, [requestPermission]); // requestPermission을 의존성 배열에 추가

    const handleTakePicture = async () => {
        const currentStepInfo = STEP_DETAILS[currentStep]; // 현재 단계 정보 가져오기

        if (currentStep === CAPTURE_STEPS.READY) { // <<<<<<< READY 단계일 경우
            if (currentStepInfo.nextStep) {
                setCurrentStep(currentStepInfo.nextStep); // 다음 단계로 바로 이동
            }
            return; // 사진 촬영 로직은 실행하지 않음
        }

        if (currentStep === CAPTURE_STEPS.REVIEW || currentStep === CAPTURE_STEPS.DONE) {
            if (currentStep === CAPTURE_STEPS.REVIEW) {
                if (currentStepInfo.nextStep) {
                    setCurrentStep(currentStepInfo.nextStep);
                }
                console.log('Review complete. Final images:', capturedImages);
                // Alert.alert('Success', 'All photos have been processed!'); // DONE 단계에서 최종 메시지
            }
            return;
        }

        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
        });

        setCapturedImages(prev => ({
            ...prev,
            [currentStep]: photo.uri,
        }));

        if (currentStepInfo.nextStep) {
            setCurrentStep(currentStepInfo.nextStep);
        } else {
            console.log('All steps complete. Final images:', capturedImages);
            setCurrentStep(CAPTURE_STEPS.DONE);
        }
        } catch (error) {
            console.error('Failed to take picture:', error);
            Alert.alert('Error', 'Could not take picture.');
        }
    };

    if (!permission) { // useCameraPermissions 훅의 반환값 확인
        return <View style={styles.centered}><Text>Requesting camera permission...</Text></View>;
    }

    if (!permission.granted) { // useCameraPermissions 훅의 반환값 확인
        return (
            <View style={styles.centered}>
                <Text>No access to camera. Please grant permission in settings.</Text>
                <TouchableOpacity onPress={requestPermission} style={styles.restartButton}>
                    <Text style={styles.restartButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const currentStepInfo = STEP_DETAILS[currentStep];

    if (hasPermission === null) {
        return <View style={styles.centered}><Text>Requesting camera permission...</Text></View>;
    }
    if (hasPermission === false) {
        return <View style={styles.centered}><Text>No access to camera. Please grant permission in settings.</Text></View>;
    }

    // 촬영 완료 후 검토 화면 (예시)
    if (currentStep === CAPTURE_STEPS.REVIEW) {
        return (
            <View style={styles.reviewContainer}>
                <StepIndicator text={currentStepInfo.indicatorText} />
                <InstructionText text={currentStepInfo.instruction} />
                {/* 여기에 촬영된 이미지들을 보여주는 UI (ImagePreview.js 등) */}
                <View style={styles.previewImageContainer}>
                {Object.entries(capturedImages).map(([stepKey, uri]) => (
                    uri && <Text key={stepKey}>{STEP_DETAILS[stepKey]?.indicatorText}: Image taken</Text> // 실제로는 Image 컴포넌트 사용
                    // 예: <Image source={{ uri }} style={styles.previewImageItem} />
                ))}
                </View>
                <CaptureButton onPress={handleTakePicture} title="Done" iconName="checkmark-circle-outline" />
            </View>
        );
    }

    if (currentStep === CAPTURE_STEPS.DONE) {
        return (
        <View style={styles.centered}>
            <StepIndicator text={currentStepInfo.indicatorText} />
            <InstructionText text={currentStepInfo.instruction} />
            <TouchableOpacity onPress={() => setCurrentStep(CAPTURE_STEPS.FRONT)} style={styles.restartButton}>
                <Text style={styles.restartButtonText}>Restart</Text>
            </TouchableOpacity>
        </View>
        );
    }


    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.cameraAreaContainer}>
                <CameraView
                style={styles.camera} // 이 스타일은 화면 전체를 채우도록 유지
                facing={facing}
                flash={flash}
                ref={cameraRef}
                />

                {/* UI 오버레이 요소들 */}
                {/* overlayContainer는 전체 화면을 덮지만, 그 안의 topControls와 bottomControlsContainer의 패딩을 조절 */}
                <View style={styles.overlayContainer}>
                    {/* 상단 컨트롤: 상단 Safe Area + 추가 여백 적용 */}
                    <View style={[styles.topControls, { paddingTop: insets.top + 10 }]}>
                        <StepIndicator text={currentStepInfo.indicatorText} />
                    </View>

                    <GuidelineOverlay type={currentStepInfo.guidelineType} />

                    {/* 하단 컨트롤: 하단 Safe Area + 추가 여백 적용 */}
                    <View style={[styles.bottomControlsContainer, { paddingBottom: insets.bottom + 15 }]}>
                        <InstructionText text={currentStepInfo.instruction} />
                        <View style={styles.actionButtonsRow}>
                            <TouchableOpacity
                                onPress={() => setFlash(current => (current === 'off' ? 'on' : (current === 'on' ? 'auto' : 'off')))}
                                style={styles.iconButton}
                            >
                                <Ionicons
                                name={
                                    flash === 'on' ? 'flash' : (flash === 'auto' ? 'flash-outline' : 'flash-off-outline')
                                }
                                size={30}
                                color="white"
                                />
                            </TouchableOpacity>

                            <CaptureButton onPress={handleTakePicture} />

                            <TouchableOpacity
                                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                                style={styles.iconButton}
                            >
                                <Ionicons name="camera-reverse-outline" size={36} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    cameraAreaContainer: {
        flex: 1,
        position: 'relative',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    cameraAreaContainer: { // <<<<<<< 추가: 카메라와 오버레이를 감싸는 컨테이너
        flex: 1, // 화면 전체를 차지하도록
        position: 'relative', // 자식의 absolute 위치 기준점이 되도록 (기본값이긴 함)
    },
    camera: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayContainer: {
        position: 'absolute', // <<<<<<< 변경: 절대 위치로 카메라 위에 겹침
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'space-between',
    },
    topControls: {
        // paddingTop: 50, // 상태 표시줄 높이 고려
        alignItems: 'center',
    },
    controlButton: { // 플래시, 카메라 전환 버튼 스타일 예시
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 5,
        marginTop: 10,
    },
    controlButtonText: {
        color: 'white',
    },
    bottomControlsContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingTop: 15,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20, // 이 패딩은 버튼들 사이의 간격을 위해 유지
        marginTop: 15,
    },
    iconButton: { // <<<<<<< 추가: 플래시, 카메라 전환 아이콘 버튼 스타일
        padding: 10, // 터치 영역 확보
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        // position: 'absolute', // 마찬가지
        // bottom: 50,
        // left: 0,
        // right: 0,
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 20,
        paddingBottom: 50, // 하단 여백
        // zIndex: 1,
    },
    reviewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    previewImageContainer: {
        marginVertical: 20,
    },
    // previewImageItem: { width: 100, height: 100, margin: 5 }, // 이미지 미리보기 스타일 예시
    restartButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    restartButtonText: {
        color: 'white',
        fontSize: 16,
    },
});