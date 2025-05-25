// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import IntroGenScreen from './screens/IntroGenScreen';
import GenWaitingScreen from './screens/GenWaitingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NameSpeakScreenimage from './screens/NameSpeakScreenimage';
import CameraCaptureScreen from './screens/CameraCaptureScreen';
import Onboarding3Screen from './screens/Onboarding3Screen';

export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NameSpeakScreenimage />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);