// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import CamReadyScreen from './screens/CamReadyScreen';
import GenWaitingScreen from './screens/GenWaitingScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NameSpeakScreen3D from './screens/NameSpeakScreen3D';


export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NameSpeakScreen3D />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);