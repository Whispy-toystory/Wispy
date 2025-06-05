import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const avatarMap = {
  pony: Pony,
  jasmin: Jasmin,
  sam: Sam,
  sun: Sun
};

export default function ProfileSelection() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const loadProfiles = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setProfiles(JSON.parse(data));
      }
    };
    loadProfiles();
  }, []);

  const renderProfile = (profile, index) => {
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
          onPress={() => {
            // TODO: 프로필 생성 화면으로 이동하거나 추가
            // TODO: 임시 예제용 프로필 추가
            const newProfile = {
              id: `profile-${Date.now()}`,
              name: 'Pony',
              avatar: 'pony',
            };
            const updated = [...profiles, newProfile];
            setProfiles(updated);
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          }}
        >
          <Image source={PlusIcon} style={styles.avatar} />
        </Pressable>
      );
    }
  };

  const profileViews = [];
  for (let i = 0; i < MAX_PROFILES; i++) {
    profileViews.push(renderProfile(profiles[i], i));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image source={WispyLogo} style={styles.logo} />
      <Text style={styles.title}>
        Choose your <Text style={styles.guardian}>guardian</Text> angel to connect with!
      </Text>

      <View style={styles.profileGrid}>{profileViews}</View>

      <Text style={styles.parentLink}>Are you a parent?</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.wispyBlue,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitExtraBold
  },
  guardian: {
    color: Colors.wispyPink,
    fontFamily: Fonts.suitExtraBold
  },
  profileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  profileContainer: {
    width: 100,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  halo: {
    width: 40,
    height: 20,
    marginBottom: -10,
  },
  name: {
    marginTop: 6,
    color: '#fff',
    fontWeight: '600',
  },
  parentLink: {
    color: '#0033CC',
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
});
