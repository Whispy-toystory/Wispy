// ProfileSelectionScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

// 컴포넌트 import
import DeleteConfirmModal from '../components/DeleteConfirmModal'; 
import TextInputConfirmModal from '../components/TextInputConfirmModal'; 
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
  const [isEditing, setIsEditing] = useState(false);

  // --- 모달 상태와 삭제 대상 프로필 상태 추가 ---
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [textInputModalVisible, setTextInputModalVisible] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  // ------------------------------------------

  useEffect(() => {
    const loadProfiles = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setProfiles(JSON.parse(data));
      }
    };
    loadProfiles();
  }, []);

  const handleAddProfile = async () => {
    if (profiles.length >= MAX_PROFILES) return;
    const newProfile = {
      id: `profile-${Date.now()}`,
      name: avatarSequence[profiles.length],
      avatar: avatarSequence[profiles.length],
    };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // --- 삭제 프로세스 관련 함수들 ---

  // 1. 삭제 시작: '-' 버튼 클릭 시 호출
  const startDeletionProcess = (profileId) => {
    setProfileToDelete(profileId); // 삭제할 프로필 ID 저장
    setDeleteModalVisible(true); // 첫 번째 확인 모달 표시
  };

  // 2. 첫 번째 모달('정말 삭제?')에서 'Yes' 클릭 시 호출
  const handleFirstConfirm = () => {
    setDeleteModalVisible(false); // 첫 번째 모달 닫기
    setTextInputModalVisible(true); // 두 번째 확인 모달 표시
  };

  // 3. 두 번째 모달('delete' 입력)에서 'Confirm' 클릭 시 호출
  const handleFinalConfirm = async () => {
    if (!profileToDelete) return;
    const updated = profiles.filter((p) => p.id !== profileToDelete);
    setProfiles(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    handleCloseModals(); // 모든 모달 닫고 초기화
  };
  
  // 4. 모든 모달을 닫고 상태를 초기화하는 함수
  const handleCloseModals = () => {
    setDeleteModalVisible(false);
    setTextInputModalVisible(false);
    setProfileToDelete(null);
  };
  // ------------------------------------------

  const renderProfileSlot = (profile, index) => {
    if (profile) {
      return (
        <Pressable
          style={styles.profileContainer}
          key={profile.id}
          onPress={isEditing ? null : () => console.log(`Selected ${profile.name}`)}
        >
          {isEditing && (
            <Pressable
              style={styles.deleteButton}
              onPress={() => startDeletionProcess(profile.id)} // 즉시 삭제 대신 삭제 프로세스 시작
            >
              <Text style={styles.deleteButtonText}>-</Text>
            </Pressable>
          )}
          <Image source={HaloImage} style={styles.halo} />
          <Image source={avatarMap[profile.avatar]} style={styles.avatar} />
          <Text style={styles.name}>{profile.name}</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          key={`add-${index}`}
          style={styles.profileContainer}
          onPress={!isEditing ? handleAddProfile : null}
        >
          <View style={styles.halo} />
          <Image source={PlusIcon} style={styles.avatar} />
        </Pressable>
      );
    }
  };

  const profileViews = Array.from({ length: MAX_PROFILES }).map((_, i) =>
    renderProfileSlot(profiles[i], i)
  );
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
            <Image source={WispyLogo} style={styles.logo} />
        </View>
        {/* -- 편집 버튼 UI 개선 -- */}
        <Pressable style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
            <View style={styles.editButtonContainer}>
               <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
                <FontAwesome name="pencil" size={16} color={Colors.wispyWhite} />
            </View>
        </Pressable>
        {/* ------------------- */}
      </View>

      <Text style={styles.title}>
        Choose your <Text style={styles.guardian}>guardian</Text>{' '}
        <Text style={styles.angel}>angel</Text> to connect with!
      </Text>

      <View style={styles.profileGrid}>{profileViews}</View>

      <Pressable onPress={() => navigation.navigate('ParentAuth')}>
        <Text style={styles.parentLink}>Are you a parent?</Text>
      </Pressable>

      {/* --- 모달 컴포넌트 렌더링 --- */}
      <DeleteConfirmModal
        visible={deleteModalVisible}
        onClose={handleCloseModals}
        onConfirm={handleFirstConfirm}
      />
      <TextInputConfirmModal
        visible={textInputModalVisible}
        onClose={handleCloseModals}
        onConfirm={handleFinalConfirm}
        title="Are you absolutely sure?"
        description="This action cannot be undone. Please type 'delete' to confirm."
        requiredText="delete"
      />
      {/* -------------------------- */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.wispyBlue,
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  logoContainer: {
    // 로고 정렬을 위해 남겨둠
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitHeavy,
    fontSize: 16,
  },
  editButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // 아이콘과 텍스트 사이 간격
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
    marginHorizontal: 20,
    color: Colors.wispyWhite,
    fontFamily: Fonts.suitExtraBold,
    marginTop: 80,
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
    paddingTop: 10,
    paddingHorizontal: 10,
    flex: 1,
    alignContent: 'center',
  },
  profileContainer: {
    width: 112,
    height: 180,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
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
    alignSelf: 'center',
    marginRight: 24,
    lineHeight: 20,
    fontFamily: Fonts.suitRegular,
  },
  // 삭제 버튼 스타일 추가
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // 다른 요소들 위에 보이도록 z-index 설정
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
});