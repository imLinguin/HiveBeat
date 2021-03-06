import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Easing,
} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import Slider from '@react-native-community/slider';
import SvgIcon from 'react-native-svg-icon';
import useStore from '../context';
import scheme from '../assets/scheme';
import icons from '../assets/icons';
import CustomText from './CustomText';
import {PanGestureHandler} from 'react-native-gesture-handler';

const Icon = props => <SvgIcon {...props} svgs={icons} />;

export default function SmallPlayer({sliderData, minimized, setMinimized}) {
  const nowPlaying = useStore(state => state.nowPlaying);
  const paused = useStore(state => state.paused);
  const setPaused = useStore(state => state.setPaused);
  const setNowPlaying = useStore(state => state.setNowPlaying);

  const showAnimation = useRef(new Animated.Value(0)).current;
  const clearAnimation = useRef(new Animated.Value(0)).current;
  const [isShown, setisShown] = useState(true);
  useEffect(() => {
    Animated.spring(showAnimation, {
      toValue: nowPlaying?.title && minimized && isShown ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const showID = Keyboard.addListener('keyboardDidShow', e => {
      setisShown(false);
    });
    const hideID = Keyboard.addListener('keyboardDidHide', e => {
      setisShown(true);
    });
    return () => {
      showID.remove(), hideID.remove();
    };
  }, [nowPlaying, minimized, isShown]);

  return (
    <PanGestureHandler
      minDist={10}
      onGestureEvent={Animated.event(
        [{nativeEvent: {translationY: clearAnimation}}],
        {
          useNativeDriver: true,
          listener: e => {
            if (e.nativeEvent.translationY > 20) {
              setMinimized(true);
              setPaused(true);
              setNowPlaying(null);
            }
            else if(e.nativeEvent.translationY < -30) {
              setMinimized(false);
            }
            Animated.timing(clearAnimation, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }).start();
          },
        },
      )}>
      <Animated.View
        style={[
          styles.minimized_player,
          {
            opacity: showAnimation,
            transform: [
              {
                translateY: showAnimation.interpolate({
                  inputRange: [0, 1, 1.1],
                  outputRange: [30, 0, 0],
                }),
              },
              {
                translateY: clearAnimation,
              },
            ],
          },
        ]}>
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
            {nowPlaying?.title && (
              <Image
                style={styles.min_image}
                source={{uri: nowPlaying.thumbnailUrl}}
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
                duration={20000}
                easing={Easing.linear}
                repeatSpacer={100}
                marqueeDelay={1500}
                disabled={!minimized}>
                {nowPlaying?.title}
              </TextTicker>
              <CustomText
                numberOfLines={1}
                style={{
                  color: scheme.textColor,
                  fontSize: 13,
                  fontWeight: '200',
                  paddingBottom: 5,
                  marginLeft: 10,
                }}>
                {nowPlaying?.author}
              </CustomText>

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
            setPaused(!paused);
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
          }}>
          {paused ? (
            <Icon width="30" height="100%" viewBox="0 0 46 60" name="Play" />
          ) : (
            <Icon viewBox="0 0 51 61" width="30" height="100%" name="Pause" />
          )}
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
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
    borderRadius: 15,
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
