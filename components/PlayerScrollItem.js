import React, {useState, useRef} from 'react';
import {View, Image, Animated, Pressable} from 'react-native';
import {useEffect} from 'react/cjs/react.development';
import scheme from '../assets/scheme';
import useStore from '../context';
import shallow from 'zustand/shallow';
import CustomText from './CustomText';
import ytmusic from '../api/ytmusic';
import {PanGestureHandler} from 'react-native-gesture-handler';

export default function PlayerScrollItem({IMAGE_SIZE, data, index}) {
  const {
    nowPlayingIndex,
    nowPlaying,
    setIndex,
    videoQueue,
    setVideoQueue,
    setNowPlaying,
  } = useStore(
    state => ({
      nowPlaying: state.nowPlaying,
      nowPlayingIndex: state.nowPlayingIndex,
      setIndex: state.setIndex,
      videoQueue: state.videoQueue,
      setVideoQueue: state.setVideoQueue,
      setNowPlaying: state.setNowPlaying,
    }),
    shallow,
  );
  const [isNowPlaying, setIsNowPlaying] = useState(true);
  const [wasNowPlaying, setWasNowPlaying] = useState(false);
  const [lockedGesture, setLocked] = useState(false);
  const [artists, setArtists] = useState('');
  const translatePos = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    setArtists(ytmusic.joinArtists(data.artists));
    setIsNowPlaying(index - 1 == nowPlayingIndex);
    !setWasNowPlaying && setWasNowPlaying(index - 1 == nowPlayingIndex)
  }, [nowPlayingIndex, nowPlaying.id]);
  return (
    <Pressable
      onPress={e => {
        if (isNowPlaying) return;
        const actualId = index - 1;
        setIndex(actualId);
        ytmusic.getVideoData(videoQueue[actualId].youtubeId).then(d => {
          const newObj = {...data, ...d, author: ytmusic.joinArtists(data.artists)};
          const newQueue = videoQueue;
          newQueue[actualId] = newObj;
          setNowPlaying(newObj);
          setVideoQueue(newQueue);
        });
      }}>
      <PanGestureHandler
        maxPointers={1}
        minOffsetY={-20}
        enabled={!wasNowPlaying && !lockedGesture }
        onGestureEvent={Animated.event(
          [{nativeEvent: {translationY: translatePos}}],
          {
            useNativeDriver: true,
            listener: e => {
              if (e.nativeEvent.translationY < -IMAGE_SIZE/4) {
                setLocked(true);
                Animated.spring(translatePos, {
                  toValue: -IMAGE_SIZE,
                  duration: 700,
                  useNativeDriver: true,
                }).start(() => {
                  const newQueue = videoQueue;
                  newQueue.splice(index - 1, 1);
                  setVideoQueue(newQueue);
                });
              } else {
                Animated.spring(translatePos, {
                  toValue: 0,
                  duration: 400,
                  useNativeDriver: true,
                }).start();
              }
            },
          },
        )}>
        <Animated.View
          style={{
            transform: [{translateY: translatePos}, {scale: translatePos.interpolate({inputRange:[-IMAGE_SIZE-1,-IMAGE_SIZE,0],outputRange:[0,0,1]})}],
            opacity: translatePos.interpolate({inputRange:[-IMAGE_SIZE,0],outputRange:[0,1]})
          }}>
          <Image
            style={{
              marginRight: 10,
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              alignSelf: 'center',
              opacity: isNowPlaying ? 1 : 0.5,
            }}
            resizeMode={'contain'}
            resizeMethod={'scale'}
            borderRadius={10}
            elevation={1}
            source={{uri: data.thumbnailUrl}}
          />
          {!isNowPlaying && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                left: 10,
                right: 10,
                top: 0,
                bottom: 0,
                position: 'absolute',
              }}>
              <CustomText
                numberOfLines={4}
                style={{
                  color: scheme.textColor,
                  elevation: 2,
                  fontWeight: '800',
                  fontSize: 32,
                  textShadowColor: '#000',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 25,
                  textAlign: 'center',
                }}>
                {data.title}
              </CustomText>
              <CustomText
                numberOfLines={2}
                style={{
                  fontSize: 20,
                  fontWeight: '300',
                  elevation: 2,
                  color: scheme.textColor,
                  textShadowRadius: 10,
                  textShadowColor: '#000',
                  textAlign: 'center',
                  textShadowOffset: {width: 0, height: 0},
                }}>
                {artists}
              </CustomText>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </Pressable>
  );
}
