// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import IntroGenScreen from './screens/IntroGenScreen';
import CharacterGenerateScreen from './screens/CharacterGenerateScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding1Screen from './screens/Onboarding1Screen';
import WelcomeScreen from './screens/WelcomeScreen';
import Onboarding2Screen from './screens/Onboarding2Screen';
import Onboarding3Screen from './screens/Onboarding3Screen';
import BirthDayPickScreen from './screens/BirthDayPickScreen';

export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <BirthDayPickScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);