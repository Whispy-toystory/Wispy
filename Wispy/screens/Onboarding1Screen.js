import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import WispyLogo from '../assets/images/logo2.png';
import HaloImage from '../assets/images/halo.png';
import PlusIcon from '../assets/images/plus.png';
import Pony from '../assets/images/pony.png';
import Jasmin from '../assets/images/jasmin.png';
import Sam from '../assets/images/sam.png';
import Sun from '../assets/images/sun.png';

const MAX_PROFILES = 4;
const STORAGE_KEY = '@wispy_profiles';

const avatarSequence = ['pony', 'sam', 'sun', 'jasmin'];
const avatarMap = {
  pony: Pony,
  jasmin: Jasmin,
  sam: Sam,
  sun: Sun,
};

export default function ProfileSelection() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [profiles, setProfiles] = useState([]);

  // 강제 초기화 함수
  const forceReset = async () => {
    try {
      console.log('🧹 강제 초기화 시작...');
      alert('🧹 강제 초기화 시작...');

      await AsyncStorage.removeItem(STORAGE_KEY);
      setProfiles([]);

      const check = await AsyncStorage.getItem(STORAGE_KEY);
      console.log('✅ 초기화 후 확인:', check);
      alert(`✅ 초기화 완료. 현재 상태: ${check}`);
    } catch (error) {
      console.log('❌ 초기화 오류:', error);
      alert(`❌ 오류 발생: ${error.message}`);
    }
  };

  // 저장된 데이터 불러오기
  useEffect(() => {
    const debugStorage = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('🔍 현재 저장된 데이터:', data);
        setProfiles(data ? JSON.parse(data) : []);
      } catch (error) {
        console.log('❌ 데이터 읽기 오류:', error);
      }
    };

    if (isFocused) {
      debugStorage();
    }
  }, [isFocused]);

  // 프로필 추가
  const handleAddProfile = () => {
    if (profiles.length >= MAX_PROFILES) return;
    navigation.navigate('Onboarding1Screen', { currentIndex: profiles.length });
  };

  // 프로필 또는 + 버튼 렌더링
  const renderProfileSlot = (profile, index) => {
    if (profile) {
      return (
        <View style={styles.profileContainer} key={index}>
          <Image source={HaloImage} style={styles.halo} />
          <Image source={avatarMap[profile.avatar]} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
        </View>
      );
    } else {
      return (
        <Pressable
          key={index}
          style={styles.profileContainer}
          onPress={handleAddProfile}
        >
          <Image source={PlusIcon} style={styles.avatar} />
        </Pressable>
      );
    }
  };

  const profileViews = [];
  for (let i = 0; i < MAX_PROFILES; i++) {
    profileViews.push(renderProfileSlot(profiles[i], i));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.logoContainer}>
        <Image source={WispyLogo} style={styles.logo} />
      </View>

      <Text style={styles.title}>
        Choose your <Text style={styles.guardian}>guardian</Text>{' '}
        <Text style={styles.angel}>angel</Text> to connect with!
      </Text>

      <View style={styles.profileGrid}>{profileViews}</View>

      {/* 강제 초기화 버튼 */}
      <Pressable onPress={forceReset}>
        <Text style={styles.resetLink}>Force Reset Profiles</Text>
      </Pressable>

      <Text style={styles.parentLink}>Are you a parent?</Text>
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
    fontSize: 20,
    textAlign: 'left',
    marginHorizontal: 20,
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitExtraBold,
    marginTop: 10,
  },
  guardian: {
    color: Colors.wispyPink,
    fontFamily: Fonts.suitExtraBold,
  },
  angel: {
    color: Colors.wispyButtonYellow,
    fontFamily: Fonts.suitExtraBold,
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  profileContainer: {
    width: 112,
    height: 180,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  halo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  name: {
    marginTop: 6,
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitHeavy,
    fontSize: 16,
  },
  parentLink: {
    color: Colors.wispyNavy,
    textDecorationLine: 'underline',
    marginBottom: 20,
    alignSelf: 'flex-end',
    marginRight: 24,
    fontFamily: Fonts.suitRegular,
  },
  resetLink: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
