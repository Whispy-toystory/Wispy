// appcopy.js
import { useFonts } from 'expo-font';
import { fontAssets } from './constants/fonts';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import PlayStartScreen from './screens/PlayStartScreen';
import ChatScreen from './screens/ChatScreen';
import Onboarding1Screen from './screens/Onboarding1Screen';
import Onboarding2Screen from './screens/Onboarding2Screen';
import Onboarding3Screen from './screens/Onboarding3Screen';
import ProfileSelection from './screens/ProfileSelection';
import DiaryScreen from './screens/DiaryScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ParentAuthScreen from './screens/ParentAuthScreen';
import ChildSelectionScreen from './screens/ChildSelectionScreen';
import BirthDayPickScreen from './screens/BirthDayPickScreen';
import CameraScreen from './screens/CameraScreen';
import ToyReadyScreen from './screens/ToyReadyScreen';
import CamReadyScreen from './screens/CamReadyScreen';
import GenWaitingScreen from './screens/GenWaitingScreen';
import GreetingScreen from './screens/GreetingScreen';
import IntroGenScreen from './screens/IntroGenScreen';
import MagicalScreen from './screens/MagicalScreen';
import NameSpeakImageScreen from './screens/NameSpeakImageScreen';
import OnboardingCompleteScreen from './screens/OnboardingCompleteScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import CharacterGenScreen from './screens/CharacterGenScreen'

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
          <Stack.Screen name="ProfileSelection" component={ProfileSelection} />
          <Stack.Screen name="ParentAuth" component={ParentAuthScreen} />
          <Stack.Screen name="ChildSelection" component={ChildSelectionScreen} />
          <Stack.Screen name="PlayStart" component={PlayStartScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Onboarding1" component={Onboarding1Screen} />
          <Stack.Screen name="Onboarding2" component={Onboarding2Screen} />
          <Stack.Screen name="Onboarding3" component={Onboarding3Screen} />
          <Stack.Screen name="Diary" component={DiaryScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="BirthDayPick" component={BirthDayPickScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="ToyReady" component={ToyReadyScreen} />
          <Stack.Screen name="CamReady" component={CamReadyScreen} />
          <Stack.Screen name="GenWaiting" component={GenWaitingScreen} />
          <Stack.Screen name="Greeting" component={GreetingScreen} />
          <Stack.Screen name="IntroGen" component={IntroGenScreen} />
          <Stack.Screen name="Magical" component={MagicalScreen} />
          <Stack.Screen name="NameSpeakImage" component={NameSpeakImageScreen} />
          <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CharacterGen" component={CharacterGenScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);