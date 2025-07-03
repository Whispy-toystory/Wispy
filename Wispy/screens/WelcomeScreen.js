import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import WispyBubble from '../assets/images/WispyBubble.png';
import { SafeAreaView } from 'react-native-safe-area-context';

const screenHeight = Dimensions.get('window').height;

function WelcomeScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        // 3초(3000ms) 후에 코드를 실행합니다.
        const timer = setTimeout(() => {
            navigation.navigate('Onboarding1'); 
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);
    
    return (
        <LinearGradient
            colors={[Colors.wispyPink, Colors.wispyBlue]}
            style={styles.gradientContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
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
            
            </SafeAreaView>

        </LinearGradient>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    gradientContainer: {
        flex: 1,
    },
    
      safeArea: {
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