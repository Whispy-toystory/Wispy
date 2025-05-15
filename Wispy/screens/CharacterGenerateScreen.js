// CharacterGenerateScreen.js
// 이 파일은 애플리케이션의 캐릭터 생성 화면을 구현합니다.
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SubAppLogo from '../components/SubAppLogo';
import Colors from "../constants/colors";
import Fonts from '../constants/fonts';
import Wisker from '../components/Wisker';
import PrimaryButton from "../components/PrimaryButton";


const screenHeight = Dimensions.get('window').height;

function CharacterGenerateScreen() {
  return (
    <LinearGradient
      colors={[Colors.wispyPink, Colors.wispyBlue]}
      style={styles.gradientContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SubAppLogo/>  
      <View style={styles.contentContainer}>
        <View style={styles.textcontainer}>
          <Text style={styles.mainText}>
            I am <Text style={{color:Colors.wispyYellow}}>Whisker</Text> the wishmaker, {'\n'}
            the magical wizard {'\n'}
            who will create your{'\n'}
            <Text style={{color:Colors.wispyOrange}}>special guardian</Text> friend!
          </Text>
        </View>
      </View>
      <View style={{flex: 0.}}/>
      {/* 캐릭터 이미지 */}
      <View style={styles.charchterImageContainer}>
        <Wisker/>
      </View>
      {/* 버튼 */}
      <View style={styles.inputContainer}>
        <PrimaryButton
        onPress={() => console.log('Next pressed')}
        textColor={Colors.wispyBlue}>Next
        </PrimaryButton>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  contentContainer: { 
    flex: 1,
  },
  textcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: screenHeight < 700 ? 20 : 24,
    lineHeight: screenHeight < 700 ? 30 : 36,
    fontFamily: Fonts.suitHeavy,
  },
  charchterImageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', 
  },
  inputContainer: {
    marginTop: 0,
    padding: 10,
    // backgroundColor: '#72063c',
    paddingBottom: 25,
    paddingHorizontal: 24,
  },
});

export default CharacterGenerateScreen;