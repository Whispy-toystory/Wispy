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
  disabled = false,
}) {
  const finalBackgroundColor = disabled ? Colors.wispyButtonDisabled : backgroundColor;

  const finalTextColor = disabled ? Colors.wispyGrey : textColor;

  return (
    <View style={[styles.buttonOuterContainer, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonInnerContainer,
          { backgroundColor: finalBackgroundColor },
          pressed && !disabled && styles.pressed,
        ]}
        onPress={disabled ? null : onPress}
        disabled={disabled}
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
