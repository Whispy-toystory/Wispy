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

const avatarSequence = ['pony', 'sam', 'sun', 'jasmin'];

const avatarMap = {
  pony: Pony,
  jasmin: Jasmin,
  sam: Sam,
  sun: Sun,
};

export default function ProfileSelectionScreen({ navigation }) {
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

  const handleAddProfile = () => {
    if (profiles.length >= MAX_PROFILES) return;

    const newProfile = {
      id: `profile-${Date.now()}`,
      name: avatarSequence[profiles.length],
      avatar: avatarSequence[profiles.length],
    };

    const updated = [...profiles, newProfile];
    setProfiles(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

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

      <Pressable onPress={() => navigation.navigate('ParentAuth')}>
        <Text style={styles.parentLink}>Are you a parent?</Text>
      </Pressable>
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
    lineHeight: 20,
    marginHorizontal: 20,
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitExtraBold,
    marginTop: 50,
    marginBottom: -50,
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
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  profileContainer: {
    width: 112,
    height: 180,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 30,
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
    lineHeight: 20,
    fontFamily: Fonts.suitRegular,
  },
});
