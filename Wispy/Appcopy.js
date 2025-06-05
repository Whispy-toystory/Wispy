// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import CamReadyScreen from './screens/CamReadyScreen';
import GenWaitingScreen from './screens/GenWaitingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NameSpeakScreenimage from './screens/NameSpeakImageScreen';
import CameraCaptureScreen from './screens/CameraScreen';
import Onboarding3Screen from './screens/Onboarding3Screen';
import BirthDayPickScreen from './screens/BirthDayPickScreen';
import OnboardingCompleteScreen from './screens/OnboardingCompleteScreen';
import MagicalScreen from './screens/MagicalScreen';

export default function Aipcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <MagicalScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);