// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import IntroGenScreen from './screens/IntroGenScreen';
import CharacterGenerateScreen from './screens/CharacterGenerateScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NameSpeakScreen from './screens/NameSpeakScreen';
import CameraCaptureScreen from './screens/CameraCaptureScreen';

export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NameSpeakScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);