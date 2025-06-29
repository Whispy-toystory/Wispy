// DeleteConfirmModal.js
import React from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import PrimaryButton from './PrimaryButton';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function DeleteConfirmModal({ visible, onClose, onConfirm }) {
  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* 경고 아이콘 이미지 */}
          <Image
            source={require('../assets/images/warning_icon.png')}
            style={styles.icon}
          />
          <Text style={styles.title}>
            Do you really want to say goodbye to your guardian angel?
          </Text>
          <Text style={styles.subtitle}>
            Once it's gone, it won't come back.
          </Text>

          <View style={styles.buttonContainer}>
            {/* Back 버튼 */}
            <PrimaryButton
              onPress={onClose}
              backgroundColor={Colors.wispyButtonYellow}
              textColor={Colors.wispyBlack}
              style={styles.button}
            >
              Back
            </PrimaryButton>
            {/* Yes 버튼 */}
            <PrimaryButton
              onPress={onConfirm}
              backgroundColor={Colors.wispyButtonYellow}
              textColor={Colors.wispyRed}
              style={styles.button}
            >
              Yes
            </PrimaryButton>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default DeleteConfirmModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: Colors.wispyBlack,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.suitHeavy,
    textAlign: 'center',
    color: Colors.wispyBlack,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: Fonts.suitExtraBold,
    color: Colors.wispyRed,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10, // 버튼 사이의 간격
  },
});