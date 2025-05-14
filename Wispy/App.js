import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import GreetingScreen from './screens/GreetingScreen';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;

  return <GreetingScreen />;
}

console.log('fontAssets:', fontAssets);