import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import WispyBubble from '../assets/images/wispybubble.png';

const screenHeight = Dimensions.get('window').height;

function WelcomeScreen() {
    return(
        <LinearGradient
        colors={[Colors.wispyPink, Colors.wispyBlue]}
        style={StyleSheet.gradientContainer}
        start={{ x: 0, y: 0 }}
        end={{ x:0, y: 1}}
        >
            
        </LinearGradient>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    }
})