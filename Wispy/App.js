import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { fontAssets } from './constants/fonts';
import CharacterGenerateScreen from './screens/CharacterGenerateScreen';

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return <AppLoading />;

  return <CharacterGenerateScreen />;
}

console.log('fontAssets:', fontAssets);