// ChatScreen.js
import React, { Suspense, useState, useEffect, useRef, memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  PixelRatio,
  KeyboardAvoidingView,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Canvas } from '@react-three/fiber/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as THREE from 'three';
import { StatusBar } from 'expo-status-bar';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { PlayContent } from '../components/PlayContent';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SlidingMenu from '../components/SlidingMenu';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const designScreenWidth = 375;
const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const ChatBubble = ({ message }) => {
  const isCharacter = message.sender === 'character';
  const bubbleStyle = isCharacter ? styles.characterBubble : styles.userBubble;
  const alignment = isCharacter ? 'flex-start' : 'flex-end';

  return (
    <View style={{ alignItems: alignment, marginVertical: 5 }}>
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={styles.chatText}>{message.text}</Text>
      </View>
    </View>
  );
};

// ChatUI 컴포넌트는 메시지 목록, 현재 날짜, 더보기 메뉴 상태, 입력 텍스트 및 메시지 전송 핸들러를 props로 받습니다
const ChatUI = memo(({
    messages,
    currentDate,
    isMoreMenuVisible,
    setMoreMenuVisible,
    inputText,
    setInputText,
    handleSendMessage,
    scrollViewRef
    }) => {
    console.log("✅ ChatUI is rendering. (This is OK)");

    return (
        <>
        <View style={styles.topBar}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <View>
            <TouchableOpacity
                style={[styles.moreButton, isMoreMenuVisible && { backgroundColor: Colors.wispyBlue }]}
                onPress={() => setMoreMenuVisible(v => !v)}>
                <Image
                    source={require('../assets/images/more.png')}
                    style={styles.moreIcon}
                />
                <Text style={{color: 'white'}}>more</Text>
            </TouchableOpacity>
            </View>
        </View>
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <View style={styles.chatArea}>
                <FlatList
                ref={scrollViewRef}
                data={messages}
                renderItem={({ item }) => <ChatBubble message={item} />}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingTop: 130, paddingBottom: 10 }}
                />
            </View>
            <ChatInputArea
                inputText={inputText}
                setInputText={setInputText}
                handleSendMessage={handleSendMessage}
            />
        </KeyboardAvoidingView>
        </>
    );
});

const ChatInputArea = memo(({ inputText, setInputText, handleSendMessage }) => {
  console.log("ChatInputArea is rendering!"); // 이 로그가 메시지 전송 시 나타나지 않아야 합니다.

  return (
    <View style={styles.inputAreaWrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={inputText}
          onChangeText={setInputText}
          returnKeyType="send"
          onSubmitEditing={() => handleSendMessage(inputText)}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={styles.flowerButtonContainer}
        onPress={() => handleSendMessage(inputText)}
      >
        <Image
          source={require('../assets/images/talking_flower.png')}
          style={styles.flowerIcon}
        />
      </TouchableOpacity>
    </View>
  );
});

function ChatScreen() {
  const navigation = useNavigation();

  const [currentDate, setCurrentDate] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'character' },
    { id: 2, text: 'Hello!', sender: 'user' },
    { id: 3, text: 'This is a longer message to check how the bubble wrapping works.', sender: 'character' },
    { id: 4, text: 'Okay, looks good!', sender: 'user' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short' });
    setCurrentDate(`${month}.${day}.${year} ${weekday}`);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages]);

  const handleSendMessage = useCallback((text) => {
      if (!text || text.trim().length === 0) return;
      const newMessage = {
          id: Date.now().toString(),
          text: text.trim(),
          sender: 'user',
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
  }, []);

  const handleDeleteConfirm = () => {
    console.log("Delete confirmed!");
    setDeleteModalVisible(false);
    navigation.navigate('ProfileSelection'); 
  };

  const onHomePress = () => navigation.navigate('ProfileSelection');
  const onDiaryPress = () => navigation.navigate('DiaryScreen');
  const onDeletePress = () => setDeleteModalVisible(true);

  const chatMenuItems = [
    { label: 'Home', color: Colors.wispyGreen, action: onHomePress },
    { label: 'Diary', color: Colors.wispyOrange, action: onDiaryPress },
    { label: 'Delete', color: Colors.wispyRed, action: onDeletePress },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} />

      {/* --- 레이어 1: 배경 & 3D 모델 --- */}
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={StyleSheet.absoluteFillObject} />
      <View style={styles.canvasContainer} pointerEvents="none">
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 1.5, 6], fov: 50 }}>
          <fog attach="fog" args={['rgb(169, 223, 255)', 5, 23]} />
          <Suspense fallback={null}>
              <group position={[0, 1, 0]}>
                  <PlayContent isAnimated={true} />
              </group>
          </Suspense>
        </Canvas>
      </View>
      
      {/* --- 레이어 2: UI --- */}
      <SafeAreaView style={styles.uiOverlay} edges={['top', 'bottom']}>
        <ChatUI
          scrollViewRef={scrollViewRef}
          messages={messages}
          currentDate={currentDate}
          isMoreMenuVisible={isMoreMenuVisible}
          setMoreMenuVisible={setMoreMenuVisible}
          onHomePress={onHomePress}
          onDiaryPress={onDiaryPress}
          onDeletePress={onDeletePress}
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={handleSendMessage}
        />
        <SlidingMenu
          isVisible={isMoreMenuVisible}
          onClose={() => setMoreMenuVisible(false)}
          menuItems={chatMenuItems}
        />
      </SafeAreaView>
      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT+50,
    bottom: 0,
  },
  keyboardAvoidingContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  uiOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    height: 80,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  dateText: {
    fontSize: normalize(18),
    fontFamily: Fonts.suitHeavy,
    color: Colors.black,
  },
  moreButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.wispyPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  moreText: {
    color: Colors.wispyWhite,
    fontSize: normalize(14),
    fontFamily: Fonts.suitHeavy,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  chatArea: {
    maxHeight: SCREEN_HEIGHT * 0.4,
  },
  bubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 10,
  },
  characterBubble: {
    backgroundColor: Colors.wispyPink,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: Colors.wispyYellow,
    borderBottomRightRadius: 4,
    alignSelf: 'flex-end',
  },
  chatText: {
    fontSize: normalize(18),
    color: Colors.wispyBlack,
    fontFamily: Fonts.suitSemiBold,
    lineHeight: 24,
  },
  inputAreaWrapper: {
    marginHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 52,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingLeft: 20,
    paddingRight: 60,
    height: '100%',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
  },
  flowerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});

export default ChatScreen;