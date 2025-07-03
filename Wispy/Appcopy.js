// appcopy.js
import { useFonts } from 'expo-font';
import { fontAssets } from './constants/fonts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import PlayStartScreen from './screens/PlayStartScreen';
import ChatScreen from './screens/ChatScreen';
import Onboarding1Screen from './screens/Onboarding1Screen';
import ProfileSelection from './screens/ProfileSelection';
import DiaryScreen from './screens/DiaryScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ParentAuthScreen from './screens/ParentAuthScreen';
import ProfileSelectionScreen from './screens/ProfileSelection';
import ChildSelectionScreen from './screens/ChildSelectionScreen';

const Stack = createNativeStackNavigator();


export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="ProfileSelection"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="ProfileSelection" component={ProfileSelectionScreen} />
          <Stack.Screen name="ParentAuth" component={ParentAuthScreen} />
          <Stack.Screen name="ChildSelection" component={ChildSelectionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);