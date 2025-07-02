// components/TextInputConfirmModal.js

import React, { useState } from 'react';
import {
  View, Text, Modal, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, Dimensions, PixelRatio, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import PrimaryButton from './PrimaryButton'; 

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const designScreenWidth = 375;
const scale = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

function TextInputConfirmModal({
  visible,
  onClose,
  onConfirm,
  title = "정말 삭제하시겠습니까?",
  description = "삭제하시려면 아래에 'Delete'를 입력해주세요.",
  requiredText = "Delete"
}) {
  const [inputText, setInputText] = useState('');
  const isMatch = inputText === requiredText;

  const handleConfirm = () => {
    if (isMatch) {
      onConfirm();
      setInputText('');
    }
  };

  const handleClose = () => {
    onClose();
    setInputText('');
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingWrapper}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                <TextInput
                  style={styles.input}
                  onChangeText={setInputText}
                  value={inputText}
                  placeholder={requiredText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                />

                <View style={styles.buttonContainer}>
                  <PrimaryButton
                    onPress={handleClose}
                    backgroundColor={Colors.wispyGrey}
                    textColor={Colors.wispyBlack}
                    style={styles.button}
                  >
                    Cancel
                  </PrimaryButton>
                  <PrimaryButton
                    onPress={handleConfirm}
                    disabled={!isMatch}
                    style={styles.button}
                    textColor={Colors.wispyRed}
                  >
                    Confirm
                  </PrimaryButton>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default TextInputConfirmModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  keyboardAvoidingWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(18),
    fontFamily: Fonts.suitHeavy,
    marginBottom: 10,
  },
  description: {
    fontSize: normalize(14),
    fontFamily: Fonts.suitRegular,
    color: Colors.wispyBlack,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: Colors.wispyGrey,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: normalize(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
});