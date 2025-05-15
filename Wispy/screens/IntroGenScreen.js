// File: IntroGenScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


const screenHeight = Dimensions.get('window').height;



function IntroGenScreen({ route }) {
  const insets = useSafeAreaInsets();

  const userName = route && route.params ? route.params.userName || 'Guest' : 'Guest'; 
  // 예시로 하드코딩된 사용자 이름입니다. 실제로는 props나 전역 상태에서 가져와야 합니다.
  const [APIuserName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true); // API 호출 중 로딩 상태 관리

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <SubAppLogo />
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.textcontainer}>
            <Text style={styles.mainText}>
              Ah, so you are <Text style={{fontWeight: 'bold', color: Colors.wispyYellow}}>{userName}</Text>!{'\n'}
              I can create your very own {'\n'}
              <Text style={{color:Colors.wispyOrange}}>special guardian</Text> friend, {'\n'}
              but <Text style={{color:Colors.wispyRed}}>only once</Text> by magic! 
            </Text>
          </View>
        </View>
        {/* 캐릭터 이미지 */}
        <View style={styles.charchterImageContainer}>
          <Wisker/>
        </View>
        {/* 버튼 */}
        <View style={styles.inputContainer}>
          <PrimaryButton
          onPress={() => console.log('Next pressed')}
          textColor={Colors.wispyBlue}>Okay, I understand</PrimaryButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: { 
    flex: 1,
  },
  textcontainer: {
    flex: 1,
    marginTop: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: screenHeight < 700 ? 20 : 24,
    lineHeight: screenHeight < 700 ? 30 : 36,
    fontFamily: Fonts.suitHeavy,
  },
  charchterImageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  inputContainer: {
    marginTop: 0,
    padding: 10,
    backgroundColor: Colors.wispyWhite,
    paddingBottom: 25,
  },
});

export default IntroGenScreen;