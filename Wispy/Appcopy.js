// appcopy.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import IntroGenScreen from './screens/IntroGenScreen';
import CharacterGenerateScreen from './screens/CharacterGenerateScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Onboarding1Screen from './screens/Onboarding1Screen';
import WelcomeScreen from './screens/WelcomeScreen';

export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;

  return (
    <SafeAreaProvider>
      <WelcomeScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);