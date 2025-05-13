import { View, Text, Pressable, StyleSheet } from 'react-native';

function PrimaryButton({
  children,
  onPress = () => {},
  textColor = '#009DFF',
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
        <Text style={[styles.buttonText, { color: textColor }, textStyle]}>
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
    backgroundColor: "#F1E150",
    paddingVertical: 15,
    paddingHorizontal: 138,
    elevation: 2,
  },
  buttonText: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
