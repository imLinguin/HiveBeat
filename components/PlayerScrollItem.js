import React from 'react';
import {View, Image, Animated, Pressable} from 'react-native';
import scheme from '../assets/scheme';
import CustomText from './CustomText';
import ytmusic from '../api/ytmusic';
import {PanGestureHandler} from 'react-native-gesture-handler';

export default class PlayerScrollItem extends React.Component {
  constructor(props) {
    super(props);
    this.isNowPlaying =
      this.props.index - 1 == this.props.context.nowPlayingIndex;
    this.wasNowPlaying = false;
    this.lockedGesture = false;
    this.artists = ytmusic.joinArtists(this.props.data.artists);
    this.translatePos = new Animated.Value(0);
  }

  shouldComponentUpdate(newProps) {
    if (
      this.props.IMAGE_SIZE !== newProps.IMAGE_SIZE ||
      this.props.context.nowPlaying.youtubeId !=
        newProps.context.nowPlaying.youtubeId
    ) {
      this.isNowPlaying =
        this.props.index - 1 == this.props.context.nowPlayingIndex;
      this.wasNowPlaying =
        this.props.index - 1 <= this.props.context.nowPlayingIndex;

      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <Pressable
        onPress={e => {
          if (this.isNowPlaying) {
            return;
          }
          const actualId = this.props.index - 1;
          this.props.context.setIndex(actualId);
          ytmusic
            .getVideoData(this.props.context.videoQueue[actualId].youtubeId)
            .then(d => {
              const newObj = {
                ...this.props.data,
                ...d,
                author: ytmusic.joinArtists(this.props.data.artists),
              };
              this.props.context.setNowPlaying(newObj);
            });
        }}>
        <PanGestureHandler
          maxPointers={1}
          minOffsetY={-20}
          enabled={
            !this.wasNowPlaying && !this.lockedGesture && !this.isNowPlaying
          }
          onGestureEvent={Animated.event(
            [{nativeEvent: {translationY: this.translatePos}}],
            {
              useNativeDriver: true,
              listener: e => {
                if (e.nativeEvent.translationY < -this.props.IMAGE_SIZE / 4) {
                  this.lockedGesture = true;
                  Animated.spring(this.translatePos, {
                    toValue: -this.props.IMAGE_SIZE,
                    duration: 700,
                    useNativeDriver: true,
                  }).start(() => {
                    const newQueue = this.props.context.videoQueue;
                    newQueue[this.props.index - 1].youtubeId ==
                      this.props.data.youtubeId &&
                      newQueue.splice(this.props.index - 1, 1);
                    this.props.context.setVideoQueue(newQueue);
                  });
                } else {
                  Animated.spring(this.translatePos, {
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
              transform: [
                {translateY: this.translatePos},
                {
                  scale: this.translatePos.interpolate({
                    inputRange: [
                      -this.props.IMAGE_SIZE - 1,
                      -this.props.IMAGE_SIZE,
                      0,
                    ],
                    outputRange: [0, 0, 1],
                  }),
                },
              ],
              opacity: this.translatePos.interpolate({
                inputRange: [-this.props.IMAGE_SIZE, 0],
                outputRange: [0, 1],
              }),
            }}>
            <Image
              style={{
                marginRight: 10,
                width: this.props.IMAGE_SIZE,
                height: this.props.IMAGE_SIZE,
                alignSelf: 'center',
                opacity: this.isNowPlaying ? 1 : 0.5,
                borderRadius: 10,
              }}
              resizeMode={'contain'}
              resizeMethod={'scale'}
              borderRadius={10}
              elevation={1}
              source={{uri: this.props.data.thumbnailUrl}}
            />
            {!this.isNowPlaying && (
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
                  {this.props.data.title}
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
                  {this.artists}
                </CustomText>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </Pressable>
    );
  }
}
