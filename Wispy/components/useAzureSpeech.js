import { useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';

// 아래 값들을 본인의 Azure Speech 서비스 정보로 교체하세요.
const SPEECH_KEY = '4fc35a0b8a0244038f6c64b92dd54162';       // 본인의 Azure 키로 변경
const SPEECH_REGION = 'southeastasia'; // 본인의 Azure 지역으로 변경

export const useAzureSpeech = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognizerRef = useRef(null);

  useEffect(() => {
    // 음성 인식기 초기 설정
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechRecognitionLanguage = 'en-US';

    const pushStream = SpeechSDK.AudioInputStream.createPushStream();
    const audioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);

    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizerRef.current = recognizer;
    
    recognizer.recognized = (s, e) => {
      if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const text = e.result.text.replace(/[.]/g, '');
        if (text) {
          setRecognizedText(text);
        }
      }
    };
    
    recognizer.sessionStopped = (s, e) => {
      setIsRecognizing(false);
    };
    
    AudioRecord.on('data', data => {
      const chunk = Buffer.from(data, 'base64');
      pushStream.write(chunk);
    });
    
    return () => {
      AudioRecord.stop();
      if (recognizerRef.current) {
        recognizerRef.current.close();
      }
    };
  }, []);

  const startRecognizing = async () => {
    if (isRecognizing) return;

    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Microphone Permission",
                    message: "App needs access to your microphone to recognize your voice.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.log("Microphone permission denied");
                return;
            }
        } catch (err) {
            console.warn(err);
            return;
        }
    }

    setRecognizedText('');
    
    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      audioSource: 6,
    };

    try {
      await AudioRecord.init(options);
      recognizerRef.current.startContinuousRecognitionAsync();
      AudioRecord.start();
      setIsRecognizing(true);
    } catch (error) {
        console.error("Failed to start Azure recognition", error);
    }
  };

  const stopRecognizing = async () => {
    if (!isRecognizing) return;

    try {
        await AudioRecord.stop();
        recognizerRef.current.stopContinuousRecognitionAsync();
    } catch (error) {
        console.error("Failed to stop Azure recognition", error);
    } finally {
        setIsRecognizing(false);
    }
  };

  return { recognizedText, isRecognizing, startRecognizing, stopRecognizing };
};