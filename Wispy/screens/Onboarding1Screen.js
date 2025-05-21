import { View, Text, StyleSheet, Dimensions, Image } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import { fontAssets } from '../constants/fonts';
import Fonts from '../constants/fonts';
import Quite from '../assets/images/quite.png';
import PrimaryButton from "../components/PrimaryButton";


const screenHeight = Dimensions.get('window').height;

function Onboarding1Screen() {
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
                <Text style={styles.mainText}>You've discovered</Text>
            </View>

            <View style={styles.inlineTextLogo}>
                <Text style={styles.mainText}>our secret </Text>
                <SubAppLogo />
            </View>

            <View style={styles.imageContainer}>
                <Image source={Quite} style={styles.image} resizeMode="contain" />
            </View>

            <View style={styles.inputContainer}>
                <PrimaryButton
                onPress={() => console.log('Next pressed')}
                textColor={Colors.wispyBlue}>Next</PrimaryButton>
            </View>
        </LinearGradient>
    )
}

export default Onboarding1Screen;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    mainText: {
        textAlign: 'center',
        color: Colors.wispyWhite,
        fontSize: 25,
        lineHeight: 40,
        fontFamily: Fonts.suitHeavy,
    },

    inlineTextLogo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

     imageContainer: {
        alignItems: 'center',
        marginBottom: 96,
    },

    image: {
        width: 313,
        height: 313,
    },

    inputContainer: {
    paddingBottom: 20,
    paddingHorizontal: 24,
  },

});
