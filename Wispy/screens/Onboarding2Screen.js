import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import Listen from '../assets/images/listen.png';
import WispyLogo from '../assets/images/logo2.png';

const screenHeight = Dimensions.get('window').height;

function Onboarding2Screen() {
  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const nicknameRegex = /^[a-zA-Z]+$/;
    setIsValid(nicknameRegex.test(nickname));
  }, [nickname]);

  const handleComplete = () => {
    console.log('Complete pressed with nickname:', nickname);
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.subAppLogoContainer}>
            <Image source={WispyLogo} style={styles.logoTopLeft} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.mainText}>Share your Wonderful</Text>
            <Text style={styles.mainText}>name with me first!</Text>
          </View>

          <View style={styles.inputBoxContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Nickname (English letters only)"
              placeholderTextColor={Colors.wispyGrey}
              value={nickname}
              onChangeText={setNickname}
              onFocus={() => setTouched(true)}
              autoCapitalize="none"
            />
            {touched && !isValid && nickname.length > 0 && (
              <Text style={styles.validationText}>
                Please use only English letters. Numbers, spaces, underscores, and special characters are not allowed.
              </Text>
            )}
          </View>

          <View style={styles.imageContainer}>
            <Image source={Listen} style={styles.image} resizeMode="contain" />
          </View>

          <View style={styles.inputContainer}>
            <PrimaryButton
              onPress={handleComplete}
              disabled={!isValid}
              textColor={isValid ? Colors.wispyPink : Colors.wispyGrey}
              backgroundColor={isValid ? Colors.wispyButtonYellow : Colors.wispyButtonDisabled}
            >
            Complete
            </PrimaryButton>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default Onboarding2Screen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  subAppLogoContainer: {
    marginLeft: 24,
    marginTop: 8,
  },
  logoTopLeft: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 83,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: 25,
    lineHeight: 40,
    fontFamily: Fonts.suitHeavy,
  },
  inputBoxContainer: {
    marginTop: 30,
    paddingHorizontal: 24,
  },
  textInput: {
    backgroundColor: Colors.wispyWhite,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: Fonts.suitMedium,
  },
  validationText: {
    color: Colors.wispyRed,
    fontSize: 12,
    marginTop: 8,
    fontFamily: Fonts.suitLight,
  },
  imageContainer: {
    marginTop: 50,
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 313,
    height: 313,
  },
  inputContainer: {
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
});
