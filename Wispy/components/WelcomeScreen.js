import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import WispyBubble from '../assets/images/WispyBubble.png';

const screenHeight = Dimensions.get('window').height;

function WelcomeScreen() {
    return (
        <LinearGradient
            colors={[Colors.wispyPink, Colors.wispyBlue]}
            style={styles.gradientContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <View>
                <SubAppLogo />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.mainText}>Hello there!</Text>
                <Text style={styles.mainText}>Welcome to Magical World!</Text>
            </View>

            <View style={styles.imageContainer}>
                <Image source={WispyBubble} style={styles.image} resizeMode="contain" />
            </View>
        </LinearGradient>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },

    logoContainer: {
        alignItems: 'flex-start',
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    mainText: {
        textAlign: 'center',
        color: Colors.wispyWhite,
        fontSize: 30,
        lineHeight:  40,
        fontFamily: Fonts.suitHeavy,
        marginHorizontal: 22,
        marginBottom: 30,
    },

    imageContainer: {
        alignItems: 'center',
        marginBottom: 96,
    },

    image: {
        width: 310,
        height: 310,
    }
});