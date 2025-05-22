// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import GenWaitingScreen from './screens/GenWaitingScreen';
import CameraCaptureScreen from './screens/CameraCaptureScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;

  return (
    <SafeAreaProvider>
      <GenWaitingScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);