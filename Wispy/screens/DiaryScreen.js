// DiaryScreen.js
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Pressable,
  Platform,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import SlidingMenu from '../components/SlidingMenu';

const calendarIcon = require('../assets/images/calendar_icon.png'); 
const moreIcon = require('../assets/images/more.png'); 
const characterImage = require('../assets/images/talking_flower.png');

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const designScreenWidth = 375;
const scaleFactor = SCREEN_WIDTH / designScreenWidth;

export function normalize(size) {
  const newSize = size * scaleFactor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// 일기가 있는 날짜에 점을 찍기 위한 가짜 데이터
const diaryEntries = ['2025-06-10', '2025-06-18', '2025-06-25', '2025-07-05'];

// 상단 헤더 컴포넌트
const DiaryHeader = ({ selectedDate, onBack, onMorePress, isMoreMenuVisible  }) => (
  <View style={styles.headerContainer}>
    {selectedDate ? (
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.headerTitle}>{'<'}</Text>
        <Text style={styles.headerTitle}>
          {'  '}{new Date(selectedDate).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            weekday: 'short',
          }).replace(',', '').toUpperCase()}
        </Text>
      </TouchableOpacity>
    ) : (
      <>
        <View style={styles.headerLeft}>
          <Image source={calendarIcon} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>Diary</Text>
        </View>
        <TouchableOpacity
          style={[styles.moreButton, isMoreMenuVisible && { backgroundColor: Colors.wispyBlue }]}
          onPress={onMorePress}
        >
          <Image
            source={moreIcon}
            style={styles.moreIconStyle}
          />
          <Text style={styles.moreButtonText}>more</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

// 커스텀 날짜 컴포넌트
const CustomDayComponent = ({ date, state, marking, onPress }) => {
    const isToday = marking?.isToday;
    const isSelected = marking?.selected;
    const hasDiary = marking?.hasDiary;
    const dayOfWeek = new Date(date.dateString).getDay(); // 0 = Sunday

    let textColor = Colors.wispyBlack;
    if (state === 'disabled') {
        textColor = Colors.wispyGrey;
    } else if (isSelected) {
        textColor = Colors.wispyWhite;
    } else if (isToday) {
        textColor = Colors.wispyBlack;
    } else if (dayOfWeek === 0) { // 일요일
        textColor = Colors.wispyRed;
    } else if (dayOfWeek === 6) { // 토요일
        textColor = Colors.wispyTextBlue;
    }

    const containerStyle = [
        styles.dayContainer,
        isToday && styles.todayContainer,
        isSelected && styles.selectedDayContainer,
    ];

    return (
        <TouchableOpacity onPress={() => onPress(date)} style={containerStyle}>
            <Text style={{ color: textColor, fontFamily: Fonts.suitRegular }}>
                {date.day}
            </Text>
            {hasDiary && !isSelected && <View style={styles.diaryDot} />}
        </TouchableOpacity>
    );
};

// 메인 Diary 화면 컴포넌트
export default function DiaryScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [isMoreMenuVisible, setMoreMenuVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const initialDate = new Date().toISOString().split('T')[0];
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  // 애니메이션을 위한 Animated.Value 생성
  const viewAnim = useRef(new Animated.Value(0)).current;
  
  // 오늘 날짜 문자열 생성
  const todayString = new Date().toISOString().split('T')[0];

  // 선택된 날짜가 없을 때 오늘 날짜로 초기화
  const markedDates = useMemo(() => {
    const todayString = new Date().toISOString().split('T')[0];
    const marks = {
      [todayString]: { isToday: true },
    };

    diaryEntries.forEach(day => {
      marks[day] = { ...marks[day], hasDiary: true };
    });

    if (selectedDate) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true };
    }

    return marks;
  }, [selectedDate]);
  
  // 날짜 선택 시 애니메이션 실행
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    Animated.spring(viewAnim, {
      toValue: 1,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  // 뒤로가기 시 애니메이션 실행
  const handleBack = () => {
    Animated.spring(viewAnim, {
      toValue: 0,
      tension: 40,
      friction: 8,
      useNativeDriver: true,
    }).start(() => setSelectedDate(null));
  };

  // 삭제 확인 모달 핸들러
  const handleDeleteConfirm = () => {
     setDeleteModalVisible(false);
     navigation.navigate('ProfileSelection');
  }

  // 홈, 플레이, 삭제 버튼 핸들러
  const onHomePress = () => navigation.navigate('ProfileSelection');
  const onPlayPress = () => navigation.navigate('ChatScreen');
  const onDeletePress = () => setDeleteModalVisible(true);
  
  // 메뉴 아이템 정의
  const diaryMenuItems = [
    { label: 'Home', color: Colors.wispyGreen, action: onHomePress },
    { label: 'Play', color: Colors.wispyOrange, action: onPlayPress },
    { label: 'Delete', color: Colors.wispyRed, action: onDeletePress },
  ];
  
  // 연도 변경 함수
  const changeYear = (yearIncrement) => {
    const currentDate = new Date(currentMonth);
    currentDate.setFullYear(currentDate.getFullYear() + yearIncrement);
    setCurrentMonth(currentDate.toISOString().split('T')[0]);
  };

  const handleDateChange = ({ year = 0 }) => {
    const [y, m] = currentMonth.split('-').map(Number);
    const currentDate = new Date(y, m - 1, 15);
    currentDate.setFullYear(currentDate.getFullYear() + year);
    setCurrentMonth(currentDate.toISOString().split('T')[0]);
  };
  
  // 커스텀 헤더 렌더링 함수
  const renderCustomHeader = (date) => {
    const headerDate = new Date(date);
    const monthText = headerDate.toLocaleString('en-US', { month: 'long' });
    const yearText = headerDate.getFullYear();

    return (
      <View style={styles.customHeaderContainer}>
        {/* 왼쪽 년도 이동 버튼 */}
        <TouchableOpacity style={styles.yearButton} onPress={() => handleDateChange({ year: -1 })}>
          <Text style={styles.yearArrowText}>{'<<'}</Text>
        </TouchableOpacity>

        {/* 월/년 텍스트 */}
        <Text style={styles.headerMonthYearText}>
          {`${monthText} ${yearText}`}
        </Text>

        {/* 오른쪽 년도 이동 버튼 */}
        <TouchableOpacity style={styles.yearButton} onPress={() => handleDateChange({ year: 1 })}>
          <Text style={styles.yearArrowText}>{'>>'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
    >
        <StatusBar style="light" translucent={true} />
        <SafeAreaView style={styles.safeArea}>
          <DiaryHeader
              selectedDate={selectedDate}
              onBack={handleBack}
            onMorePress={() => setMoreMenuVisible(v => !v)}
            isMoreMenuVisible={isMoreMenuVisible}
            />
            <SlidingMenu
            isVisible={isMoreMenuVisible}
            onClose={() => setMoreMenuVisible(false)}
            menuItems={diaryMenuItems}
            />

            {/* 캘린더와 스토리 뷰를 담는 애니메이션 컨테이너 */}
            <View style={styles.contentContainer}>
                {/* 캘린더 뷰 */}
                <Animated.View style={[styles.animatedView, {
                    transform: [{
                        translateX: viewAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -SCREEN_WIDTH],
                        })
                    }]
                }]}>
                    <View style={styles.calendarWrapper}>
                    <Calendar
                        key={currentMonth}
                        current={currentMonth}
                        initialDate={currentMonth}
                        onMonthChange={(month) => setCurrentMonth(month.dateString)}
                        renderHeader={renderCustomHeader}
                        enableSwipeMonths={true}
                        markingType={'custom'}
                        dayComponent={CustomDayComponent}
                        markedDates={markedDates}
                        onDayPress={onDayPress}
                        
                        monthFormat={'MMM yyyy'}
                        theme={{
                        backgroundColor: 'transparent',
                        textSectionTitleColor: Colors.wispyBlack,
                        selectedDayTextColor: Colors.wispyWhite,
                        textDisabledColor: Colors.wispyGrey,
                        arrowColor: Colors.wispyNavy,
                        monthTextColor: Colors.wispyBlack,
                        textDayFontFamily: Fonts.suitMedium,
                        textMonthFontFamily: Fonts.suitHeavy,
                        textDayHeaderFontFamily: Fonts.suitBold,
                        monthLineHeight: normalize(30),
                        textDayFontSize: normalize(14),
                        textMonthFontSize: normalize(16),
                        textDayHeaderFontSize: normalize(12),
                        'stylesheet.calendar.header': {
                            week: { marginTop: normalize(15), flexDirection: 'row', justifyContent: 'space-around' },
                            dayTextAtIndex0: { color: Colors.wispyRed },      // 일요일
                            dayTextAtIndex1: { color: Colors.wispyBlack },
                            dayTextAtIndex2: { color: Colors.wispyBlack },
                            dayTextAtIndex3: { color: Colors.wispyBlack },
                            dayTextAtIndex4: { color: Colors.wispyBlack },
                            dayTextAtIndex5: { color: Colors.wispyBlack },
                            dayTextAtIndex6: { color: Colors.wispyTextBlue }, // 토요일
                        },
                        }}
                        style={styles.calendar}
                    />
                    </View>

                    <View style={styles.bottomContainer}>
                        <View style={styles.speechBubbleWrapper}>
                            <View style={styles.speechBubbleContent}>
                                <Text style={styles.speechBubbleText}>
                                    Pick a day to see our day's story!
                                </Text>
                            </View>
                            <View style={styles.speechBubblePointer} />
                        </View>
                        <Image source={characterImage} style={styles.characterImage} />
                    </View>
                </Animated.View>
         {/* 스토리 뷰 */}
            {selectedDate && (
                 <Animated.View style={[styles.animatedView, {
                    transform: [{
                        translateX: viewAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [SCREEN_WIDTH, 0],
                        })
                    }]
                }]}>
                    <View style={styles.storyContainer}>
                        <Text style={styles.storyTitle}>Story</Text>
                        <Text style={styles.storyContent}>Content for {selectedDate}</Text>
                    </View>
                </Animated.View>
            )}
        
        </View>
        
      </SafeAreaView>
      <DeleteConfirmModal
        visible={isDeleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingTop: Platform.OS === 'android' ? normalize(30) : normalize(10),
  },
  headerLeft: {
    marginTop: normalize(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: normalize(35),
    height: normalize(35),
    marginRight: normalize(10),
  },
  headerTitle: {
    fontFamily: Fonts.suitHeavy,
    paddingTop: 10,
    fontSize: normalize(24),
    lineHeight: normalize(24),
    color: Colors.wispyWhite,
  },
  backButton: {
    marginTop: normalize(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
   moreButton: {
        marginTop:5,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.wispyPink,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreIconStyle: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    moreButtonText: {
        color: 'white',
        fontSize: normalize(12),
        fontFamily: Fonts.suitHeavy,
    },
    diaryDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: Colors.wispyGreen,
        position: 'absolute',
        bottom: 5,
    },
    calendarWrapper: {
        marginHorizontal: normalize(20),
        marginVertical: normalize(10),
        borderRadius: normalize(20),
        backgroundColor: Colors.wispyWhite,
        height: normalize(420),
        paddingBottom: normalize(10),
        elevation: 8,
        shadowColor: Colors.wispyBlack,
        shadowOpacity: 0.15,
        shadowRadius: 15,
  },
  calendar: {
    height: '100%',
    borderRadius: normalize(20),
  },
  dayContainer: {
    width: normalize(40),
    height: normalize(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: normalize(20),
  },
  todayContainer: {
    backgroundColor: Colors.wispyButtonYellow,
    borderRadius: 16,
  },
  selectedDayContainer: {
    backgroundColor: Colors.wispyTextBlue,
    borderRadius: 16,
  },
  customHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerMonthYearText: {
    fontSize: normalize(18),
    lineHeight: normalize(20),
    fontFamily: Fonts.suitExtraBold,
    color: Colors.wispyBlack,
  },
  yearButton: {
    paddingHorizontal: 20,
  },
  yearArrowText: {
    fontSize: normalize(16),
    lineHeight: normalize(20),
    color: Colors.wispyNavy,
    fontFamily: Fonts.suitHeavy,
  },
  bottomContainer: {
    flex: 1,
    paddingVertical: normalize(10),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  speechBubbleWrapper: {
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  speechBubbleContent: {
    backgroundColor: Colors.wispyButtonYellow,
    paddingHorizontal: normalize(18),
    paddingVertical: normalize(12),
    borderRadius: normalize(15),
    maxWidth: '90%',
  },
  speechBubbleText: {
    textAlign: 'center',
    color: Colors.wispyTextBlue,
    fontSize: normalize(14),
    fontFamily: Fonts.suitHeavy,
    lineHeight: normalize(18),
  },
  speechBubblePointer: {
    width: 0,
    height: 0,
    borderLeftWidth: normalize(10),
    borderRightWidth: normalize(10),
    borderTopWidth: normalize(15),
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.wispyButtonYellow,
    alignSelf: 'center',
  },
  characterImage: {
    width: normalize(120),
    height: normalize(120),
    resizeMode: 'contain',
  },
  // --- 상세 뷰 스타일 ---
  storyContainer: {
    flex: 1,
    backgroundColor: Colors.wispyWhite,
    margin: normalize(20),
    borderRadius: normalize(20),
    padding: normalize(20),
  },
  storyTitle: {
    fontFamily: Fonts.suitHeavy,
    lineHeight: normalize(20),
    fontSize: normalize(18),
    color: Colors.wispyTextBlue,
    marginBottom: normalize(10),
  },
  storyContent: {
    fontFamily: Fonts.suitRegular,
    fontSize: normalize(16),
    lineHeight: normalize(20),
    color: Colors.wispyBlack,
  },
  contentContainer: {
    flex: 3,
    position: 'relative',
  },
  animatedView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});