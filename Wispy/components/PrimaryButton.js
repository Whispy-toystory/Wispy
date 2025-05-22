import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

function PrimaryButton({
  children,
  onPress = () => {},
  textColor = Colors.wispyBlack,
  backgroundColor = Colors.wispyButtonYellow,
  style = {},
  textStyle = {},
  disabled = false, // ✅ 새로 추가
}) {
  const finalBackgroundColor = disabled
    ? Colors.wispyButtonDisabled // ✅ 비활성 배경색
    : backgroundColor;

  const finalTextColor = disabled
    ? Colors.wispyGrey // ✅ 비활성 텍스트색
    : textColor;

  return (
    <View style={[styles.buttonOuterContainer, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonInnerContainer,
          { backgroundColor: finalBackgroundColor },
          pressed && !disabled && styles.pressed, // ✅ disabled면 누름 효과 제거
        ]}
        onPress={disabled ? null : onPress} // ✅ 비활성일 때 onPress 제거
        disabled={disabled} // ✅ 실제 비활성 처리
        android_ripple={disabled ? null : { color: '#8F8311' }}
      >
        <Text style={[styles.buttonText, { color: finalTextColor }, textStyle]}>
          {children}
        </Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: Fonts.suitHeavy,
    fontSize: 22,
  },
  pressed: {
    opacity: 0.75,
  },
});
