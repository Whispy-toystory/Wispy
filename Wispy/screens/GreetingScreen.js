import { View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import Colors from "../constants/colors";

function GreetingScreen() {
  return (
    <View style={styles.inputContainer}>
      <PrimaryButton
        onPress={() => console.log('Next pressed')}
        textColor={Colors.wispyBlue}
      >
        Next
      </PrimaryButton>
    </View>
  );
}

export default GreetingScreen;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 700,
    padding: 24,
    backgroundColor: '#72063c',
  },
});
