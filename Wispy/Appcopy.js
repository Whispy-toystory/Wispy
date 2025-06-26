// appcopy.js
import { useFonts } from 'expo-font';
import { fontAssets } from './constants/fonts';
import PlayStartScreen from './screens/PlayStartScreen';
import ChatScreen from './screens/ChatScreen';
import NameSpeakImageScreen from './screens/NameSpeakImageScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();


export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <PlayStartScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);