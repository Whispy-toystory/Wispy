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
import MagicalScreen from './screens/MagicalScreen';

const Stack = createNativeStackNavigator();


export default function Appcopy() {
  const [fontsLoaded] = useFonts(fontAssets);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ProfileSelection" component={ProfileSelection} />
          <Stack.Screen name="Onboarding1Screen" component={Onboarding1Screen} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ChatScreen"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="ProfileSelection" component={ProfileSelection} />
          <Stack.Screen name="Onboarding1Screen" component={Onboarding1Screen} />
        </Stack.Navigator>
      </NavigationContainer> */}
    </SafeAreaProvider>
  );
}

console.log('fontAssets:', fontAssets);