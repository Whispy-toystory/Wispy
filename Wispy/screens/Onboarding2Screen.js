import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
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

  const showValidation = touched && nickname.length > 0 && !isValid;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient
        colors={[Colors.wispyPink, Colors.wispyBlue]}
        style={styles.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            <View style={styles.subAppLogoContainer}>
              <Image source={WispyLogo} style={styles.logoTopLeft} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Share your Wonderful</Text>
              <Text style={styles.mainText}>
                <Text style={styles.nameText}>name</Text> with me first!
              </Text>
            </View>

            <View style={styles.inputBoxContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  isValid && styles.textInputValidBorder,
                ]}
                placeholder="Nickname (English letters only)"
                placeholderTextColor={Colors.wispyGrey}
                value={nickname}
                onChangeText={setNickname}
                onFocus={() => setTouched(true)}
                autoCapitalize="none"
              />

              <View style={styles.validationTextContainer}>
                <Text
                  style={[
                    styles.redText,
                    !showValidation && styles.invisibleText,
                  ]}
                >
                  Please use only English letters.
                </Text>
                <Text
                  style={[
                    styles.greyText,
                    !showValidation && styles.invisibleText,
                  ]}
                >
                  Numbers, spaces, underscores, and special characters are not allowed.
                </Text>
              </View>
            </View>

            <View style={styles.imageContainer}>
              <Image source={Listen} style={styles.image} resizeMode="contain" />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              onPress={handleComplete}
              disabled={!isValid}
              textColor={isValid ? Colors.wispyPink : Colors.wispyGrey}
              backgroundColor={isValid ? Colors.wispyButtonYellow : Colors.wispyButtonDisabled}
            >
              Complete
            </PrimaryButton>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

export default Onboarding2Screen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
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
  nameText: {
    color: Colors.wispyNavy,
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
    borderWidth: 2, // 항상 유지
    borderColor: 'transparent', // 초기값은 보이지 않게
  },
  textInputValidBorder: {
    borderColor: Colors.wispyButtonYellow,
  },
  validationTextContainer: {
    marginTop: 8,
    minHeight: 36,
  },
  redText: {
    color: Colors.wispyRed,
    fontSize: 12,
    fontFamily: Fonts.suitExtraBold,
    lineHeight: 16,
  },
  greyText: {
    color: Colors.wispyRed,
    fontSize: 12,
    fontFamily: Fonts.suitLight,
    lineHeight: 16,
  },
  invisibleText: {
    opacity: 0,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 313,
    height: 313,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
});
