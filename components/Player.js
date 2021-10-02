import React, {useContext, useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  BackHandler,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import MusicControl from 'react-native-music-control';
import TextTicker from 'react-native-text-ticker';
import SvgIcon from 'react-native-svg-icon';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {BlurView} from '@react-native-community/blur';
import {videoContext} from '../context';
import icons from '../assets/icons';
import scheme from '../assets/scheme';
import SmallPlayer from './SmallPlayer';

const Icon = props => <SvgIcon {...props} svgs={icons} />;

export default function Player() {
  const videoRef = useRef(null);
  const fullPlayerMov = useRef(
    new Animated.Value(Dimensions.get('screen').height),
  ).current;
  const context = useContext(videoContext);
  const [minimized, setMinimized] = useState(true);
  const [sliderData, setSlider] = useState({});

  const getURL = () => {
    // for (let i = 0; i < context.nowPlaying?.formatStreams.length; i++) {
    //   let item = context.nowPlaying?.formatStreams[i];
    //   if (
    //     (item.itag === '18' ||
    //     item.itag === '140') && item.hasAudio
    //   ) {
    //     return item;
    //   }
    // }
    return context.nowPlaying?.formatStreams[0];
  };

  const getReadableTime = seconds => {
    let minutes = Math.floor(seconds / 60);
    let outSec = Math.round(seconds - minutes * 60);

    outSec = outSec < 10 ? '0' + outSec : outSec;
    return `${minutes}:${outSec}`;
  };

  const onLoadStart = () => {
    setSlider({...sliderData, currentTime: 0});
    MusicControl.setNowPlaying({
      title: context.nowPlaying.title,
      artwork: context.nowPlaying.thumbnailUrl,
      artist: context.nowPlaying.author,
      duration: Math.round(context.nowPlaying.lengthSeconds),
    });
    MusicControl.updatePlayback({
      state: MusicControl.STATE_BUFFERING,
      elapsedTime: 0,
    });
  };

  useEffect(() => {
    Animated.spring(fullPlayerMov, {
      toValue: minimized ? Dimensions.get('screen').height : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
    const onBackPress = () => {
      if (minimized) {
        return false;
      } else {
        setMinimized(true);
        return true;
      }
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [minimized]);

  useEffect(() => {
    if (context.nowPlaying.title) {
      MusicControl.enableControl('play', true);
      MusicControl.enableControl('pause', true);
      MusicControl.enableControl('stop', false);
      MusicControl.enableControl('nextTrack', true);
      MusicControl.enableControl('previousTrack', true);
      MusicControl.enableControl('pauseView', false);
      MusicControl.enableControl('seek', true);
      MusicControl.enableControl('changePlaybackPosition', true);
      MusicControl.on('play', () => {
        context.setPaused(false);
      });
      MusicControl.on('pause', () => {
        context.setPaused(true);
      });
      MusicControl.on('seek', time => {
        videoRef.current.seek(time);
      });
      MusicControl.enableBackgroundMode(true);
    }
    context.setPaused(false);
  }, [context.nowPlaying.title]);

  useEffect(() => {
    if (context.nowPlaying?.title) {
      MusicControl.updatePlayback({
        state: context.paused
          ? MusicControl.STATE_PAUSED
          : MusicControl.STATE_PLAYING,
        elapsedTime: Math.round(sliderData?.currentTime) || 0,
      });
    }
  }, [context.paused]);

  return (
    <View>
      {context.nowPlaying.title ? (
        <Video
          ref={videoRef}
          onEnd={() => {
            setMinimized(true);
            videoRef.current.seek(0);
            context.setPaused(true);
          }}
          audioOnly
          paused={context.paused}
          onProgress={data => {
            setSlider(data);
          }}
          onSeek={t => {
            setSlider(t);
            MusicControl.updatePlayback({
              elapsedTime: sliderData.currentTime || 0,
            });
          }}
          onLoadStart={onLoadStart}
          onBuffer={data => {
            MusicControl.updatePlayback({
              elapsedTime: Math.round(sliderData?.currentTime) || 0,
              state: data.isBuffering
                ? MusicControl.STATE_BUFFERING
                : context.paused
                ? MusicControl.STATE_PAUSED
                : MusicControl.STATE_PLAYING,
            });
          }}
          playInBackground
          onAudioBecomingNoisy={() => context.setPaused(true)}
          source={{uri: getURL().url}}
        />
      ) : null}
      <SmallPlayer sliderData={sliderData} minimized={minimized} setMinimized={setMinimized} />
      {context.nowPlaying?.title ? (
        <Animated.View
          style={{
            ...styles.full_player_wrapper,
            transform: [{translateY: fullPlayerMov}],
            opacity: fullPlayerMov.interpolate({
              inputRange: [0, Dimensions.get('screen').height],
              outputRange: [1, 0],
            }),
          }}>
          <BlurView
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
            blurType={'dark'}
            blurAmount={15}
          />

          <PanGestureHandler
            maxPointers={1}
            onGestureEvent={Animated.event(
              [{nativeEvent: {translationY: fullPlayerMov}}],
              {useNativeDriver: false},
            )}
            onHandlerStateChange={e => {
              if (
                e.nativeEvent.oldState === State.ACTIVE &&
                e.nativeEvent.translationY > 100
              ) {
                setMinimized(true);
              } else {
                Animated.spring(fullPlayerMov, {
                  toValue: minimized ? Dimensions.get('screen').height : 0,
                  duration: 400,
                  useNativeDriver: true,
                }).start();
              }
            }}>
            <View
              style={{
                marginTop: StatusBar.currentHeight,
                flexDirection: 'row',
                height: 50,
                marginHorizontal: 20,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{height: 20}}
                onPress={() => setMinimized(true)}>
                <Text
                  style={{
                    ...styles.text,
                    fontSize: 15,
                    fontWeight: '100',
                  }}>
                  \/
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: 50,
                  height: 3,
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: 10,
                }}
              />
              <View />
            </View>
          </PanGestureHandler>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height,
            }}>
            <Image
              style={{
                height: 350,
                width: '90%',
              }}
              resizeMode={'cover'}
              borderRadius={20}
              elevation={1}
              source={{uri: context.nowPlaying.thumbnailUrl}}
            />
            <View style={styles.metadata_full_wrapper}>
              <TextTicker
                style={styles.full_player_title}
                scroll
                loop
                numberOfLines={1}
                duration={10000}
                repeatSpacer={150}
                bounce={false}
                marqueeDelay={1500}>
                {context.nowPlaying?.title ? context.nowPlaying.title : ''}
              </TextTicker>
              <Text
                style={{
                  ...styles.text,
                  fontSize: 17,
                  paddingBottom: 15,
                  fontWeight: '100',
                }}>
                {context.nowPlaying?.author}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Slider
                minimumTrackTintColor="#fff"
                maximumTrackTintColor="#fff"
                thumbTintColor="#fff"
                value={sliderData.currentTime}
                maximumValue={sliderData.seekableDuration}
                tapToSeek
                onSlidingComplete={v => {
                  setSlider({...sliderData, currentTime: v});
                  videoRef.current.seek(v);
                }}
                style={{width: '100%'}}
              />
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.text}>
                  {getReadableTime(sliderData.currentTime)}
                </Text>
                <Text style={styles.text}>
                  {getReadableTime(sliderData.seekableDuration)}
                </Text>
              </View>
            </View>
            <View style={styles.full_player_controls}>
              <TouchableOpacity>
                <Icon width="50" height="50" viewBox="0 0 52 74" name="Back" />
              </TouchableOpacity>
              <View
                style={{
                  marginVertical: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Icon
                  style={{position: 'absolute', alignSelf: 'center'}}
                  width="100"
                  height="90"
                  name="PlayBorder"
                />
                <TouchableOpacity
                  onPress={() => {
                    context.setPaused(!context.paused);
                  }}>
                  {context.paused ? (
                    <Icon
                      width="55"
                      height="50"
                      viewBox="0 0 46 60"
                      name="Play"
                      style={{alignSelf: 'center'}}
                    />
                  ) : (
                    <Icon
                      width="50"
                      height="50"
                      viewBox="0 0 51 61"
                      name="Pause"
                      style={{alignSelf: 'center'}}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Icon width="50" height="50" viewBox="0 0 52 74" name="Skip" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {color: scheme.textColor},
  full_player_wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('screen').height,
    backgroundColor: '#0000',
  },
  full_player_title: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingVertical: 15,
    color: scheme.textColor,
  },
  metadata_full_wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  full_player_controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 40,
  },
});
