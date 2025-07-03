// ParentAuthScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import WispyLogo from '../assets/images/logo2.png';

const PIN_LENGTH = 6;
const PARENT_PASSWORD_KEY = 'parent_password';

export default function ParentAuthScreen({ navigation }) {
  const [stage, setStage] = useState('loading');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');

  // 저장된 비밀번호가 있는지 확인합니다.
  useEffect(() => {
    const checkPassword = async () => {
      try {
        const storedPassword = await SecureStore.getItemAsync(PARENT_PASSWORD_KEY);
        // 저장된 비밀번호가 있으면 'enter', 없으면 'create' 단계로 설정합니다.
        setStage(storedPassword ? 'enter' : 'create');
      } catch (e) {
        // 에러가 발생하면 콘솔에 로그를 남기고, 사용자에게 알립니다.
        console.error('Failed to access SecureStore', e);
        setError('Security settings could not be loaded.');
        setStage('create');
      }
    };
    checkPassword();
  }, []);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH) return;

    const handlePinComplete = async () => {
      switch (stage) {
        case 'create':
          setFirstPin(pin);
          setStage('confirm');
          setPin('');
          break;
        case 'confirm':
          if (pin === firstPin) {
            try {
              // 비밀번호가 일치하면 저장합니다.
              await SecureStore.setItemAsync(PARENT_PASSWORD_KEY, pin);
              setStage('enter');
              setPin('');
            } catch (e) {
              console.error('Failed to save password to SecureStore', e);
              setError('An error occurred. Please try again.');
            }
          } else {
            setError('The passcodes do not match. Please try again.');
            setStage('create');
            setFirstPin('');
            setPin('');
          }
          break;
        case 'enter':
          try {
            const storedPassword = await SecureStore.getItemAsync(PARENT_PASSWORD_KEY);
            if (pin === storedPassword) {
              // 로그인 성공 시, 부모용 프로필 관리 화면으로 이동합니다.
              navigation.replace('ChildSelection');
            } else {
              setError('Incorrect passcode. Please try again.');
              setPin('');
            }
          } catch (e) {
            console.error('Failed to verify password from SecureStore', e);
            setError('An error occurred during verification.');
            setPin('');
          }
          break;
      }
    };

    handlePinComplete();
  }, [pin, stage, firstPin, navigation]);

  const handleKeyPress = (num) => {
    if (error) setError('');
    if (pin.length < PIN_LENGTH) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleResetPassword = () => {
    SecureStore.deleteItemAsync(PARENT_PASSWORD_KEY).then(() => {
      alert('Passcode has been reset. Please create a new one.');
      setStage('create');
      setPin('');
      setFirstPin('');
      setError('');
    });
  };

  const getTitle = () => {
    if (stage === 'create') return 'Create a Parent Passcode';
    if (stage === 'confirm') return 'Confirm Your Passcode';
    if (stage === 'enter') return 'Enter Parent Passcode';
    return 'Loading...';
  };

  const handleGoHome = () => {
    navigation.navigate('ProfileSelection');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable onPress={handleGoHome} style={styles.logoContainer}>
          <Image source={WispyLogo} style={styles.logo} />
      </Pressable>
      <View style={styles.topContainer}>
        <Text style={styles.title}>{getTitle()}</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : <Text style={styles.errorPlaceholder} />}
      </View>

      {/* stage가 'loading'이 아닐 때만 PIN 입력 UI를 보여줍니다. */}
      {stage !== 'loading' && (
        <>
          <View style={styles.pinContainer}>
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <View key={i} style={[styles.pinDot, pin.length > i && styles.pinDotFilled]} />
            ))}
          </View>
          <View style={styles.keyboardContainer}>
            {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, rowIndex) => (
              <View key={rowIndex} style={styles.keyboardRow}>
                {row.map((num) => (
                  <Pressable key={num} style={styles.key} onPress={() => handleKeyPress(num)}>
                    <Text style={styles.keyText}>{num}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
            <View style={styles.keyboardRow}>
              <View style={styles.keyPlaceholder} />
              <Pressable style={styles.key} onPress={() => handleKeyPress(0)}>
                <Text style={styles.keyText}>0</Text>
              </Pressable>
              <Pressable style={styles.key} onPress={handleDelete}>
                <Text style={styles.keyText}>⌫</Text>
              </Pressable>
            </View>
          </View>
          <Pressable onPress={handleResetPassword}>
            <Text style={styles.resetLink}>Forgot Passcode?</Text>
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.wispyBlue,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  topContainer: {
    alignItems: 'center',
    width: '100%',
    flex: 1, 
    justifyContent: 'center'
  },
  logoContainer: {
    alignSelf: 'flex-start',
    marginLeft: 24,
    marginTop: 8,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    color: Colors.wispyNavy,
    fontFamily: Fonts.suitExtraBold,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.wispyRed,
    fontFamily: Fonts.suitRegular,
    fontSize: 14,
    marginTop:10,
  },
  errorPlaceholder: {
    marginBottom: 10,
  },
  pinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pinDot: {
    width: 30,
    height: 30,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.wispyWhite,
    margin: 10,
  },
  pinDotFilled: {
    backgroundColor: Colors.wispyWhite,
  },
  keyboardContainer: {
    width: '80%',
    marginTop: 40,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  key: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.wispyWhite,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  keyPlaceholder: {
    width: 70,
    height: 70,
  },
  keyText: {
    fontSize: 28,
    fontFamily: Fonts.suitHeavy,
    color: Colors.wispyNavy,
  },
  resetLink: {
    color: Colors.wispyNavy,
    textDecorationLine: 'underline',
    fontFamily: Fonts.suitRegular,
    fontSize: 16,
    padding: 10,
    marginTop: 20,
  },
});