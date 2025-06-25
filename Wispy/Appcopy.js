// appcopy.js
import { useFonts } from 'expo-font';
import { fontAssets } from './constants/fonts';
import PlayStartScreen from './screens/PlayStartScreen';
import ChatScreen from './screens/ChatScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NameSpeakScreen3D from './screens/NameSpeakScreen3D';

export default function Aipcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <ChatScreen/>
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);