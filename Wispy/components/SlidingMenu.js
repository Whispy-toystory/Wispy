// components/SlidingMenu.js

import React, { useState, useEffect, useRef } from 'react';
import { Animated, Text, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors';

// normalize 함수를 더 이상 사용하지 않으므로 import 경로를 삭제하거나 주석 처리합니다.

export default function SlidingMenu({ isVisible, onClose, menuItems = [] }) {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [isRendered, setIsRendered] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setIsRendered(true);
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }).start(() => {
        setIsRendered(false);
      });
    }
  }, [isVisible]);

  if (!isRendered) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.menuOverlay}
      activeOpacity={1}
      onPress={onClose}
      pointerEvents={isVisible ? 'auto' : 'none'}
    >
      {menuItems.map((item, index) => {
        const transY = slideAnim.interpolate({
          inputRange: [0, 1],
          // [수정] 버튼 간격 및 시작 위치 조정
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
            <Pressable
              onPress={() => {
                onClose();
                item.action();
              }}
              style={[styles.slidingMenuButton, { backgroundColor: item.color }]}
              disabled={!isVisible}
            >
              <Text style={styles.slidingMenuButtonText}>{item.label}</Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: 99,
  },
  slidingMenuButtonContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});