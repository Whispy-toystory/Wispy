import { View, Text, Pressable, StyleSheet } from 'react-native';

function PrimaryButton({ children }) {
    function pressHandler() {
        console.log('Pressed!');
    }

  return (
    <View style={styles.buttonOuterContainer}>
        <Pressable 
        style={({pressed}) => pressed ? [styles.buttonInnerContainer, styles.pressed]
        : styles.buttonInnerContainer}
        onPress={pressHandler}
        android_ripple={{color:'#8F8311'}}
        >
        <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
    buttonOuterContainer: {
        borderRadius: 12,
        overflow: 'hidden'
    },
    buttonInnerContainer: {
        backgroundColor: "#F1E150",
        paddingVertical: 15,
        paddingHorizontal: 138,
        elevation: 2
    },
    buttonText: {
        color: '#009DFF',
        textAlign: "center"
    },
    pressed: {
        opacity: 0.75
    }
});
