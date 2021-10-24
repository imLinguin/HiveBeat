import React, {useContext, useRef, useState, useEffect} from 'react';
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
  if (outSec === 60) outSec = 0;
  outSec = outSec < 10 ? '0' + outSec : outSec;
  return `${minutes}:${outSec}`;
};

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
  const context = useContext(videoContext);
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
  };
  const nextSong = () => {
    if (!context.videoQueue[context.nowPlayingIndex + 1]) {
      context.setPaused(true);
    } else {
      context.setNowPlayingIndex(context.nowPlayingIndex + 1);
    }
  };
  const previousSong = () => {
    if (sliderData.currentTime > 10) {
      videoRef.current.seek(0);
      setSlider({...sliderData, currentTime: 0});
      context.setPaused(false);
    } else if (context.nowPlayingIndex != 0) {
      context.setNowPlayingIndex(context.nowPlayingIndex - 1);
    }
  };
  useEffect(() => {
    if (context.videoQueue[context.nowPlayingIndex]?.title) {
      const item = context.videoQueue[context.nowPlayingIndex];
      ytmusic.getVideoData(item.youtubeId).then(d => {
        const artists = [];
        item.artists.forEach(el => {
          artists.push(el.name);
        });
        const newObj = {...item, ...d, author: artists.join(', ')};
        context.setNowPlaying(newObj);
        const newQueue = context.videoQueue;
        newQueue[context.nowPlayingIndex] = newObj;
        context.setVideoQueue(newQueue);
        context.setPaused(false);
      });
    }
    imageListRef.current?.scrollToOffset({
      offset: (IMAGE_SIZE + 10) * context.nowPlayingIndex,
      animated: true,
    });
  }, [context.nowPlayingIndex]);

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
        setSlider({...sliderData, currentTime: time});
      });
      MusicControl.on('nextTrack', () => {
        context.setNowPlayingIndex(context.nowPlayingIndex + 1);
      });
      MusicControl.enableBackgroundMode(true);
    } else {
      MusicControl.resetNowPlaying();
    }
    context.setPaused(false);
  }, [context.nowPlaying.title]);

  useEffect(() => {
    if (context.nowPlaying?.title) {
      MusicControl.setNowPlaying({
        title: context.nowPlaying.title,
        artwork: context.nowPlaying.thumbnailUrl,
        artist: context.nowPlaying.author,
        duration: Number(context.nowPlaying.lengthSeconds),
      });
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
      {context.nowPlaying.url ? (
        <Video
          ref={videoRef}
          onEnd={() => {
            nextSong();
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
          source={{uri: context.nowPlaying.url}}
        />
      ) : null}
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
            {useNativeDriver: true},
          )}
          onHandlerStateChange={e => {
            if (
              e.nativeEvent.oldState === State.ACTIVE &&
              e.nativeEvent.translationY > 100
            ) {
              setMinimized(true);
            } else {
              Animated.spring(fullPlayerMov, {
                toValue: minimized ? height : 0,
                duration: 400,
                useNativeDriver: true,
              }).start();
            }
          }}>
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
                flex: 2,
                height: '100%',
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
                  keyExtractor={(item) =>
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
                  style={styles.full_player_title}
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
                  duration={10000}
                  repeatSpacer={150}
                  bounce={false}
                  marqueeDelay={1500}>
                  {context.videoQueue[context.nowPlayingIndex]?.title}
                </TextTicker>
                <TouchableOpacity
                  onPress={() => {
                    setMinimized(true);
                    navigation.navigate('Artist', {
                      id: context.videoQueue[context.nowPlayingIndex].artists[0]
                        ?.id,
                    });
                  }}>
                  <CustomText
                    style={{
                      ...styles.text,
                      fontSize: 17,
                      paddingBottom: 15,
                      fontWeight: '100',
                    }}>
                    {context.videoQueue[context.nowPlayingIndex]?.author}
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
                  <CustomText style={styles.text}>
                    {getReadableTime(sliderData.currentTime)}
                  </CustomText>
                  <CustomText style={styles.text}>
                    {getReadableTime(sliderData.seekableDuration)}
                  </CustomText>
                </View>
              </View>
              <View style={styles.full_player_controls}>
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
                  onPress={() => {
                    previousSong();
                  }}>
                  <Icon
                    width="50"
                    height="50"
                    viewBox="0 0 52 74"
                    name="Back"
                  />
                </Pressable>
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
                  <Pressable
                    style={{height: 50, width: 55}}
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
                  <Icon
                    width="50"
                    height="50"
                    viewBox="0 0 52 74"
                    name="Skip"
                  />
                </Pressable>
                <Pressable>
                  <CustomText style={styles.text}>L</CustomText>
                </Pressable>
              </View>
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
  },
  full_player_controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 15,
  },
});
