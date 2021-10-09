import React, {useContext, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import Slider from '@react-native-community/slider';
import SvgIcon from 'react-native-svg-icon';
import {videoContext} from '../context';
import scheme from '../assets/scheme';
import icons from '../assets/icons';
const Icon = props => <SvgIcon {...props} svgs={icons} />;

export default function SmallPlayer({sliderData, minimized, setMinimized}) {
  const context = useContext(videoContext);
  const showAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(showAnimation, {
      toValue: (context.nowPlaying?.title && minimized) ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [context.nowPlaying, minimized]);

  return (
    <Animated.View style={[styles.minimized_player, {opacity: showAnimation, transform:[{translateY: showAnimation.interpolate({inputRange:[0,1], outputRange:[30,0]})}]}]}>
      <TouchableOpacity
        style={{
          paddingLeft: 10,
          flexDirection: 'row',
          height: '100%',
          width: '70%',
          alignItems: 'center',
        }}
        onPress={() => {
          setMinimized(false);
        }}>
        <>
          {context.nowPlaying?.title && (
            <Image
              style={styles.min_image}
              source={{uri: context.nowPlaying.thumbnailUrl}}
            />
          )}
          <View style={styles.metadata_min_wrapper}>
            <TextTicker
              style={styles.player_title}
              scroll
              loop
              bounce={false}
              animationType="scroll"
              numberOfLines={1}
              duration={5000}
              repeatSpacer={100}
              marqueeDelay={1500}
              disabled={!minimized}>
              {context.nowPlaying?.title}
            </TextTicker>
            <Text
              style={{
                color: scheme.textColor,
                fontSize: 13,
                fontWeight: '200',
                paddingBottom: 5,
                marginLeft: 10,
              }}>
              {context.nowPlaying?.author}
            </Text>

            <Slider
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#fff"
              thumbTintColor="#fff0"
              style={{width: '100%', height: 10, marginBottom: 5}}
              value={sliderData.currentTime}
              maximumValue={sliderData.seekableDuration}
            />
          </View>
        </>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          context.setPaused(!context.paused);
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingRight: 5,
        }}>
        {context.paused ? (
          <Icon width="30" height="100%" viewBox="0 0 46 60" name="Play" />
        ) : (
          <Icon viewBox="0 0 51 61" width="30" height="100%" name="Pause" />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  minimized_player: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 20,
    borderColor: scheme.colorPrimary,
    borderWidth: 2,
  },
  metadata_min_wrapper: {
    width: '100%',
    marginLeft: 5,
  },
  min_image: {
    height: 40,
    width: 40,
    resizeMode: 'cover',
    borderRadius: 5,
    padding: 5,
  },
  player_title: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 15,
    color: scheme.textColor,
  },
  text: {color: scheme.textColor},
});
