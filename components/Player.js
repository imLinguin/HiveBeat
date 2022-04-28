import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  BackHandler,
  useWindowDimensions,
  Pressable,
  Dimensions,
  StatusBar,
  ToastAndroid,
  Alert,
  Easing,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import MusicControl from 'react-native-music-control';
import TextTicker from 'react-native-text-ticker';
import SvgIcon from 'react-native-svg-icon';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {BlurView} from '@react-native-community/blur';
import useStore from '../context';
import icons from '../assets/icons';
import scheme from '../assets/scheme';
import ytmusic from '../api/ytmusic';
import SmallPlayer from './SmallPlayer';
import Loading from './Loading';
import PlayerScrollItem from './PlayerScrollItem';
import {useNavigation} from '@react-navigation/core';
import CustomText from './CustomText';

const Icon = props => <SvgIcon {...props} svgs={icons} />;

const getReadableTime = seconds => {
  seconds = Math.round(seconds);
  let minutes = Math.floor(seconds / 60);
  let outSec = Math.round(seconds % 60);
  if (outSec === 60) {
    outSec = 0;
  }
  outSec = outSec < 10 ? '0' + outSec : outSec;
  return `${minutes}:${outSec}`;
};

function easeInOutExpo(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}

export default function Player() {
  const navigation = useNavigation();
  const {width, height} = useWindowDimensions();
  const IMAGE_SIZE = width - 70;
  const SPACER_SIZE = (width - IMAGE_SIZE) / 2;
  const videoRef = useRef(null);
  const fullPlayerMov = useRef(
    new Animated.Value(Dimensions.get('screen').height),
  ).current;
  const imageListRef = useRef(null);
  const context = useStore();
  const [minimized, setMinimized] = useState(true);
  const [sliderData, setSlider] = useState({});
  const [shouldSliderUpdate, setSliderUpdate] = useState(true);
  const [isBuffering, setBuffering] = useState(false);

  const onLoadStart = () => {
    setSlider({...sliderData, currentTime: 0});
    MusicControl.setNowPlaying({
      title: context.nowPlaying.title,
      artwork: context.nowPlaying.thumbnailUrl,
      artist: context.nowPlaying.author,
      duration: Number(context.nowPlaying.lengthSeconds),
    });
    MusicControl.updatePlayback({
      state: MusicControl.STATE_BUFFERING,
      elapsedTime: 0,
    });
    setBuffering(true);
    context.setPaused(false);
  };
  const nextSong = useCallback(() => {
    if (!context.videoQueue[context.nowPlayingIndex + 1]) {
      if (context.loop != 0)
        ytmusic.getVideoData(context.videoQueue[0].youtubeId).then(v => {
          const newObj = {...context.videoQueue[0], ...v};
          context.setNowPlaying(newObj);
          context.setIndex(0);
        });
      else {
        context.setPaused(true);
      }
    } else {
      const targetIndex = context.nowPlayingIndex + 1;
      context.increaseIndex();
      ytmusic
        .getVideoData(context.videoQueue[targetIndex].youtubeId)
        .then(v => {
          const newData = {
            ...context.videoQueue[targetIndex],
            ...v,
            author: ytmusic.joinArtists(
              context.videoQueue[targetIndex].artists,
            ),
          };
          context.setNowPlaying(newData);
        });
    }
  }, [context]);
  const previousSong = useCallback(() => {
    if (sliderData.currentTime > 10) {
      videoRef.current.seek(0);
      setSlider({...sliderData, currentTime: 0});
      context.setPaused(false);
    } else if (context.nowPlayingIndex != 0) {
      const targetIndex = context.nowPlayingIndex - 1;
      context.decreaseIndex();
      setBuffering(true);
      const song = context.videoQueue[targetIndex];
      ytmusic
        .getVideoData(context.videoQueue[targetIndex].youtubeId)
        .then(v => {
          const newData = {
            ...context.videoQueue[targetIndex],
            ...v,
            author: ytmusic.joinArtists(
              context.videoQueue[targetIndex].artists,
            ),
          };
          context.setNowPlaying(newData);
        });
    }
  }, [context, sliderData]);
  useEffect(() => {
    imageListRef.current?.scrollToOffset({
      offset: (IMAGE_SIZE + 10) * context.nowPlayingIndex,
      animated: true,
    });
  }, [IMAGE_SIZE, context.nowPlayingIndex]);

  useEffect(() => {
    Animated.timing(fullPlayerMov, {
      toValue: minimized ? Dimensions.get('screen').height : 0,
      duration: 600,
      easing: easeInOutExpo,
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
  }, [fullPlayerMov, minimized]);

  useEffect(() => {
    if (context.nowPlaying?.title) {
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
        setSlider({...sliderData, currentTime: time});
      });
      MusicControl.on('nextTrack', nextSong);
      MusicControl.on('previousTrack', previousSong);
      MusicControl.enableBackgroundMode(true);
    } else {
      MusicControl.resetNowPlaying();
    }
  }, [context, context.nowPlaying, nextSong, previousSong, sliderData]);

  useEffect(() => {
    if (context.nowPlaying?.title) {
      MusicControl.updatePlayback({
        state: context.paused
          ? MusicControl.STATE_PAUSED
          : MusicControl.STATE_PLAYING,
        elapsedTime: Number(sliderData?.currentTime) || 0,
      });
    }
  }, [context.nowPlaying?.title, context.paused, sliderData?.currentTime]);

  return (
    <View>
      {context.nowPlaying?.url && (
        <Video
          ref={videoRef}
          onEnd={() => {
            if (context.loop == 2) {
              videoRef.current.seek(0);
            } else {
              nextSong();
            }
          }}
          audioOnly
          paused={context.paused}
          preventsDisplaySleepDuringVideoPlayback={false}
          onProgress={data => {
            shouldSliderUpdate && setSlider(data);
          }}
          onSeek={t => {
            setSlider({currentTime: t.currentTime, ...sliderData});
            MusicControl.updatePlayback({
              elapsedTime: sliderData.currentTime || 0,
            });
          }}
          onLoadStart={onLoadStart}
          onBuffer={data => {
            setBuffering(data.isBuffering);
            MusicControl.updatePlayback({
              elapsedTime: Number(sliderData?.currentTime) || 0,
              state: data.isBuffering
                ? MusicControl.STATE_BUFFERING
                : context.paused
                ? MusicControl.STATE_PAUSED
                : MusicControl.STATE_PLAYING,
            });
          }}
          playInBackground
          onAudioBecomingNoisy={() => context.setPaused(true)}
          source={{uri: context.nowPlaying.url}}
        />
      )}
      <SmallPlayer
        sliderData={sliderData}
        minimized={minimized}
        setMinimized={setMinimized}
      />
      {context.nowPlaying?.title ? (
        <PanGestureHandler
          maxPointers={1}
          enabled={!minimized}
          minOffsetY={30}
          onGestureEvent={Animated.event(
            [{nativeEvent: {translationY: fullPlayerMov}}],
            {
              useNativeDriver: true,
              listener: e => {
                if (e.nativeEvent.translationY > 100) {
                  setMinimized(true);
                } else {
                  Animated.timing(fullPlayerMov, {
                    toValue: minimized ? Dimensions.get('screen').height : 0,
                    duration: 200,
                    easing: easeInOutExpo,
                    useNativeDriver: true,
                  }).start();
                }
              },
            },
          )}>
          <Animated.View
            style={[
              styles.full_player_wrapper,
              {
                transform: [{translateY: fullPlayerMov}],
                opacity: fullPlayerMov.interpolate({
                  inputRange: [0, height],
                  outputRange: [1, 0],
                }),
                height: height + StatusBar.currentHeight,
              },
            ]}>
            <BlurView
              style={StyleSheet.absoluteFillObject}
              blurType={'dark'}
              blurAmount={15}
            />

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
                <CustomText
                  style={{
                    ...styles.text,
                    fontSize: 15,
                    fontWeight: '100',
                  }}>
                  \/
                </CustomText>
              </TouchableOpacity>
              <View
                style={{
                  width: 50,
                  height: 3,
                  left: '50%',
                  transform: [{translateX: -25}],
                  position: 'absolute',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: 10,
                }}
              />
              <View />
            </View>
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 30,
              }}>
              <View style={{height: IMAGE_SIZE, width: '100%'}}>
                <Animated.FlatList
                  ref={imageListRef}
                  style={{height: IMAGE_SIZE, width: '100%'}}
                  data={[
                    {spacer: true, youtubeId: '-2'},
                    ...context.videoQueue,
                    {spacer: true, youtubeId: '-1'},
                  ]}
                  keyExtractor={item =>
                    item?.youtubeId + item.title + 'carousel'
                  }
                  horizontal={true}
                  scrollEventThrottle={16}
                  decelerationRate={0.76}
                  disableIntervalMomentum
                  snapToInterval={IMAGE_SIZE + 10}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) =>
                    item?.thumbnailUrl ? (
                      <PlayerScrollItem
                        context={context}
                        data={item}
                        index={index}
                        IMAGE_SIZE={IMAGE_SIZE}
                      />
                    ) : (
                      <View style={{width: SPACER_SIZE, height: IMAGE_SIZE}} />
                    )
                  }
                />
              </View>
              <View style={styles.metadata_full_wrapper}>
                <TextTicker
                  style={[styles.full_player_title]}
                  scroll
                  loop
                  onPress={() => {
                    imageListRef.current &&
                      imageListRef.current.scrollToOffset({
                        offset: (IMAGE_SIZE + 10) * context.nowPlayingIndex,
                        animated: true,
                      });
                  }}
                  numberOfLines={1}
                  duration={20000}
                  easing={Easing.linear}
                  repeatSpacer={150}
                  bounce={false}
                  marqueeDelay={1500}>
                  {context.videoQueue[context.nowPlayingIndex]?.title}
                </TextTicker>
                <TouchableOpacity
                  onPress={() => {
                    if (
                      !context.videoQueue[context.nowPlayingIndex].artists[0]
                        ?.id
                    ) {
                      Alert.alert(
                        'YO!',
                        "YouTube doesn't provide any ID for that artist",
                        [{text: 'Okay, okay'}],
                        {cancelable: true},
                      );
                      return;
                    }
                    console.log(
                      context.videoQueue[context.nowPlayingIndex].artists[0]
                        ?.id,
                    );
                    setMinimized(true);
                    navigation.navigate('Artist', {
                      id: context.videoQueue[context.nowPlayingIndex].artists[0]
                        ?.id,
                      name: context.videoQueue[context.nowPlayingIndex]
                        .artists[0]?.name,
                    });
                  }}>
                  <CustomText
                    style={{
                      ...styles.text,
                      fontSize: 17,
                      paddingBottom: 15,
                      fontWeight: '100',
                    }}>
                    {context.nowPlaying.author}
                  </CustomText>
                </TouchableOpacity>
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
                  onSlidingStart={v => {
                    setSliderUpdate(false);
                  }}
                  onSlidingComplete={v => {
                    setSliderUpdate(true);
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
                  <CustomText style={[styles.text, {fontWeight: '700'}]}>
                    {getReadableTime(sliderData.currentTime)}
                  </CustomText>
                  <CustomText
                    style={[styles.text, {fontWeight: '300', opacity: 0.7}]}>
                    {getReadableTime(sliderData.seekableDuration)}
                  </CustomText>
                </View>
              </View>
            </View>
            <View style={styles.full_player_controls}>
              <Pressable
                onPress={() => {
                  previousSong();
                }}>
                <Icon width="50" height="50" viewBox="0 0 52 74" name="Back" />
              </Pressable>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Pressable
                  style={{height: 60, width: 60, justifyContent: 'center'}}
                  onPress={() => {
                    return context.setPaused(!context.paused);
                  }}>
                  {isBuffering ? (
                    <Loading style={{width: 55, height: 45}} />
                  ) : context.paused ? (
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
                </Pressable>
              </View>
              <Pressable
                onPress={() => {
                  nextSong();
                }}>
                <Icon width="50" height="50" viewBox="0 0 52 74" name="Skip" />
              </Pressable>
            </View>
            <View style={styles.bottom_bar}>
              <Pressable
                onPress={() => {
                  const newVal = !context.shuffle;
                  context.setShuffle(newVal);
                  ToastAndroid.showWithGravity(
                    newVal ? 'Shuffle Enabled' : 'Shuffle Disabled',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }}
                style={{padding: 5}}>
                <CustomText style={styles.text}>S</CustomText>
              </Pressable>
              <Pressable
                onPress={e => {
                  context.changeLoop();
                  let newVal = context.loop + 1;
                  if (newVal == 3) newVal = 0;
                  ToastAndroid.showWithGravity(
                    newVal != 0
                      ? newVal == 1
                        ? 'Queue Looping'
                        : 'Song Looping'
                      : 'Looping Disabled',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }}
                style={{padding: 5}}>
                <CustomText style={styles.text}>L</CustomText>
              </Pressable>
            </View>
          </Animated.View>
        </PanGestureHandler>
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
    backgroundColor: '#0000',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  full_player_title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
    color: scheme.textColor,
  },
  metadata_full_wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
  },
  full_player_controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 2,
    paddingHorizontal: 40,
  },
  bottom_bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 0,
    paddingBottom: 30,
  },
});
