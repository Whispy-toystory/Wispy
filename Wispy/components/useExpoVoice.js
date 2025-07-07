import { useState, useEffect, useCallback } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

export const useExpoVoice = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [error, setError] = useState('');

  useSpeechRecognitionEvent('start', () => setIsRecognizing(true));
  useSpeechRecognitionEvent('end', () => setIsRecognizing(false));
  
  useSpeechRecognitionEvent('result', (event) => {
    // 최종 결과만 가져오도록 설정
    if (event.isFinal) {
      setRecognizedText(event.results[0]?.transcript || '');
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    setError(`Error: ${event.error} - ${event.message}`);
    setIsRecognizing(false);
  });

  const startRecognizing = async () => {
    const permissions = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permissions.granted) {
      setError("Permissions not granted.");
      return;
    }

    setRecognizedText('');
    setError('');

    // 음성 인식 시작
    ExpoSpeechRecognitionModule.start({
      lang: 'en-US',
      continuous: false, // 하나의 구문만 인식
      interimResults: false, // 중간 결과는 받지 않음
    });
  };

  const stopRecognizing = async () => {
    await ExpoSpeechRecognitionModule.stop();
  };

  return { recognizedText, isRecognizing, error, startRecognizing, stopRecognizing };
};
