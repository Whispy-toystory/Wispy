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
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Canvas } from '@react-three/fiber/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as THREE from 'three';
import { StatusBar } from 'expo-status-bar';

// 사용자 프로젝트의 실제 경로 및 이름으로 수정
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import { PlayContent } from '../components/PlayContent';
import Flower3DModel from '../components/Flower3DModelComponent';

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

const ChatUI = memo(({
    messages,
    currentDate,
    isMoreMenuVisible,
    setMoreMenuVisible,
    inputText,
    setInputText,
    handleSendMessage
    }) => {
    console.log("✅ ChatUI is rendering. (This is OK)");

    return (
        <>
        {/* 상단 툴바 */}
        <View style={styles.topBar}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <View>
            <TouchableOpacity style={styles.moreButton} onPress={() => setMoreMenuVisible(v => !v)}>
                {/* more 버튼 이미지 또는 텍스트 */}
                <Image
                    source={require('../assets/images/more.png')} // 이미지 파일 경로
                    style={styles.moreIcon} // 이미지 스타일 적용
                />
                <Text style={{color: 'white'}}>more</Text>
            </TouchableOpacity>
            <SlidingMenu isVisible={isMoreMenuVisible} onClose={() => setMoreMenuVisible(false)} />
            </View>
        </View>

        {/* 키보드 대응 영역 */}
        <KeyboardAvoidingView
            style={styles.keyboardAvoidingContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <FlatList
            data={messages}
            renderItem={({ item }) => <ChatBubble message={item} />}
            keyExtractor={item => item.id.toString()}
            style={styles.messageList}
            contentContainerStyle={{ paddingTop: 130, paddingBottom: 10 }}
            />
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
          source={require('../assets/images/talking_flower.png')} // 예시 경로, 실제 이미지로 교체
          style={styles.flowerIcon}
        />
      </TouchableOpacity>
    </View>
  );
});

// sliding menu component
const SlidingMenu = ({ isVisible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isVisible ? 1 : 0,
      tension: 60,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  if (!isVisible) return null;

  const menuItems = [
    { label: 'Diary', color: Colors.wispyOrange },
    { label: 'Delete', color: Colors.wispyRed },
  ];

  return (
    <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={onClose}>
      {menuItems.map((item, index) => {
        const transY = slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (index + 1) * 75],
        });
        const opacity = slideAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.2, 1],
        });
        return (
          <Animated.View
            key={item.label}
            style={[styles.slidingMenuButtonContainer, { transform: [{ translateY: transY }], opacity }]}
          >
            <TouchableOpacity style={[styles.slidingMenuButton, { backgroundColor: item.color }]}>
              <Text style={styles.slidingMenuButtonText}>{item.label}</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </TouchableOpacity>
  );
};

function ChatScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello!', sender: 'character' },
    { id: 2, text: 'Hello!', sender: 'user' },
    { id: 3, text: 'This is a longer message to check how the bubble wrapping works.', sender: 'character' },
    { id: 4, text: 'Okay, looks good!', sender: 'user' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
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
        // 함수형 업데이트로 messages 의존성 제거
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setInputText('');
    }, []); // 의존성 배열을 비워야 합니다! inputText도 제거.
    

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent={true} />

      {/* --- 레이어 1: 배경 & 3D 모델 --- */}
      <LinearGradient colors={['#4facfe', '#00f2fe']} style={StyleSheet.absoluteFillObject} />
      <Canvas style={StyleSheet.absoluteFillObject} gl={{ alpha: true }} camera={{ position: [0, 1.5, 6], fov: 50 }}>
        <Suspense fallback={null}>
            <group position={[0, 0.8, 0]}>
                <PlayContent />
            </group>
        </Suspense>
      </Canvas>
      
      {/* --- 레이어 2: UI --- */}
      <SafeAreaView style={styles.uiOverlay} edges={['top', 'bottom']}>
        <ChatUI
        messages={messages}
        currentDate={currentDate}
        isMoreMenuVisible={isMoreMenuVisible}
        setMoreMenuVisible={setMoreMenuVisible}
        inputText={inputText}
        setInputText={setInputText}
        handleSendMessage={handleSendMessage}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: 40, // 상태바 및 노치 영역 고려
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
    slidingMenuButtonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 64,
    height: 64,
  },
  slidingMenuButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidingMenuButtonText: {
    color: 'white',
    fontSize: normalize(14),
    fontWeight: 'bold',
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
    maxWidth: '80%',
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
    fontSize: normalize(16),
    color: Colors.wispyBlack,
    fontFamily: Fonts.suitSemiBold,
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