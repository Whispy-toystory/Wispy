import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';

const MagicalScreen = () => {
  const player = useVideoPlayer(require('../assets/video/arrived.mov'), player => {
    player.loop = false;
    player.play();
  });

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.mainText}>
          Something magical{'\n'}is about to happen~
        </Text>
        <Text style={styles.mainText}>
          <Text style={styles.subText}>Good luck </Text>
          on your{'\n'}Wispy adventure!
        </Text>
      </View>

      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        contentFit="cover"
      />
    </View>
  );
};

export default MagicalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  textWrapper: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  mainText: {
    textAlign: 'center',
    color: Colors.wispyWhite,
    fontSize: 25,
    lineHeight: 40,
    fontFamily: Fonts.suitHeavy,
    marginBottom: 10,
  },
  subText: {
    color: Colors.wispyButtonYellow,
    fontFamily: Fonts.suitHeavy,
  },
  video: {
    width: 270,
    height: 405,
    borderRadius: 16,
  },
});