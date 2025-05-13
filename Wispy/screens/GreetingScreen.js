import { TextInput, View } from "react-native";

import PrimaryButton from "../components/PrimaryButton";

function GreetingScreen() {
    return (
    <View>
        <TextInput />
        <PrimaryButton>Next</PrimaryButton>
        <PrimaryButton>Call</PrimaryButton>
    </View>
    );
}

export default GreetingScreen;