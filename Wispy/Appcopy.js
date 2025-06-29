// appcopy.js
import { useFonts } from 'expo-font';
import { fontAssets } from './constants/fonts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import PlayStartScreen from './screens/PlayStartScreen';
import ChatScreen from './screens/ChatScreen';
import Onboarding1Screen from './screens/Onboarding1Screen';
import ProfileSelection from './screens/Onboarding1Screen';
import DiaryScreen from './screens/DiaryScreen';

const Stack = createNativeStackNavigator();


export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          // DiaryScreen을 테스트하기 위해 시작 화면으로 설정합니다.
          initialRouteName="ChatScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="DiaryScreen" component={DiaryScreen} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="ProfileSelection" component={ProfileSelection} />
          <Stack.Screen name="Onboarding1Screen" component={Onboarding1Screen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);