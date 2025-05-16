// app.js
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import WelcomeScreen from './screens/WelcomeScreen';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;

  return <WelcomeScreen />;
}

console.log('fontAssets:', fontAssets);