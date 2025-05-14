import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

function PrimaryButton({
  children,
  onPress = () => {},
  textColor = Colors.wispyBlack,
  style = {},
  textStyle = {}
}) {
  return (
    <View style={[styles.buttonOuterContainer, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.buttonInnerContainer,
          pressed && styles.pressed
        ]}
        onPress={onPress}
        android_ripple={{ color: '#8F8311' }}
      >
        <Text style={[styles.buttonText, { color: textColor }]}>
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
    backgroundColor: Colors.wispyButtonYellow,
    paddingVertical: 15,
    paddingHorizontal: 138,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: Fonts.suitHeavy,
    fontSize: 22
  },
  pressed: {
    opacity: 0.75,
  },
});
