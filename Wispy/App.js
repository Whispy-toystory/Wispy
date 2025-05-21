// app.js
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import WelcomeScreen from './screens/WelcomeScreen';
import Onboarding1Screen from './screens/Onboarding1Screen';
import * as Font from 'expo-font';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;

  return <Onboarding1Screen />;
}
