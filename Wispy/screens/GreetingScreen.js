import { TextInput, View, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";

function GreetingScreen() {
    return (
    <View style={styles.inputContainer}>
        <PrimaryButton>Next</PrimaryButton>
    </View>
    );
}

export default GreetingScreen;

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 700,
        padding: 24,
        backgroundColor: '#72063c'
    }
});