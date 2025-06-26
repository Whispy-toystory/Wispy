import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import PrimaryButton from '../components/PrimaryButton';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

import WispyLogo from '../assets/images/logo2.png';
import Listen from '../assets/images/listen.png';

const screenHeight = Dimensions.get('window').height;

function BirthDayPickScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const isValid = selectedDate !== null;

  const handleComplete = () => {
    console.log('Complete pressed, selected birthday:', selectedDate);
    // TODO: 여기에 생일 정보 전송 로직 추가
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.subAppLogoContainer}>
          <Image source={WispyLogo} style={styles.logoTopLeft} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.mainText}>
            Now, can you tell me {'\n'} 
            when your <Text style={styles.subText}>birthday</Text>{' '} is?
          </Text>
        </View>

        <TouchableOpacity onPress={showDatePicker} style={styles.dateInputContainer}>
          <Text style={selectedDate ? styles.dateInputText : styles.dateInputPlaceholder}>
            {selectedDate ? moment(selectedDate).format('MM/DD/YYYY') : 'Please enter your birthday'}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          headerTextIOS="Please enter your birthday"
          confirmTextIOS="confirm"
          cancelTextIOS="cancel"
        />

        <View style={styles.imageContainer}>
          <Image source={Listen} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            onPress={handleComplete}
            disabled={!isValid}
            textColor={isValid ? Colors.wispyPink : Colors.wispyGrey}
            backgroundColor={isValid ? Colors.wispyButtonYellow : Colors.wispyButtonDisabled}
          >
            Complete
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default BirthDayPickScreen;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  subAppLogoContainer: {
    marginLeft: 24,
    marginTop: 8,
  },
  logoTopLeft: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 83,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: 25,
    lineHeight: 40,
    fontFamily: Fonts.suitHeavy,
  },
  subText: {
    color: Colors.wispyButtonYellow,
    fontFamily: Fonts.suitHeavy,
  },
  dateInputContainer: {
    backgroundColor: Colors.wispyWhite,
    borderRadius: 10,
    marginHorizontal: 40,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30, // 텍스트와 이미지 사이의 간격 조정
  },
  dateInputText: {
    color: Colors.wispyDarkGrey,
    fontSize: 18,
    fontFamily: Fonts.suitMedium,
  },
  dateInputPlaceholder: {
    color: Colors.wispyGrey,
    fontSize: 18,
    fontFamily: Fonts.suitMedium,
  },
  imageContainer: {
    // marginTop: 10, // DatePicker를 추가했으므로 마진 조정
    alignItems: 'center',
    // marginBottom: 30, // 버튼과의 간격 조정
    flex: 1, // 남은 공간을 차지하도록 flex 설정하여 이미지가 중앙에 위치하도록 함
    justifyContent: 'center', // 이미지를 수직 중앙 정렬
  },
  image: {
    width: 313,
    height: 313,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // iOS 하단 여백 조정
    marginTop: 'auto', // 버튼을 하단에 붙이도록 설정
  },
});