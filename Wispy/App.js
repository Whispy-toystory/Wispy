// app.js
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import IntroGenScreen from './screens/IntroGenScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;


  return (
    <SafeAreaProvider>
      <IntroGenScreen />
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);