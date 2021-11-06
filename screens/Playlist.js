import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  useWindowDimensions,
  Animated,
  StyleSheet,
  StatusBar,
  Image,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SharedElement} from 'react-navigation-shared-element';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {getColorFromURL} from 'rn-dominant-color';
import SongPreview from '../components/SongPreview';
import CustomText from '../components/CustomText';
import Loading from '../components/Loading';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import shallow from 'zustand/shallow';
import useStore from '../context';
import TextTicker from 'react-native-text-ticker';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Playlist({route}) {
  const context = useStore(
    state => ({
      setPaused: state.setPaused,
      setNowPlaying: state.setNowPlaying,
      setIndex: state.setIndex,
      setVideoQueue: state.setVideoQueue,
      shuffle: state.shuffle,
      nowPlaying: state.nowPlaying,
    }),
    shallow,
  );
  const [songs, setSongs] = useState([]);
  const [dominantColor, setDominantColor] = useState('#363636FF');
  const gradientVisibility = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const {width, height} = useWindowDimensions();
  const IMAGE_SIZE = width / 1.6;
  useEffect(() => {
    if (songs.length > 0) return;
    ytmusic.getPlaylistSongs(route.params.data.playlistId).then(playlistData => {
      if (playlistData) {
        setSongs(playlistData);
        getColorFromURL(route.params.data?.thumbnailUrl).then(v => {
          setDominantColor(v);
          Animated.timing(gradientVisibility, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        });
      }
    });
  }, []);

  const play = index => {
    const v = songs[index];
    if (context.nowPlaying.id !== v.youtubeId){
      context.setPaused(true);
      ytmusic.getVideoData(v.youtubeId).then(d => {
        let newQueue = [];
        v.thumbnailUrl = ytmusic.manipulateThumbnailUrl(
          v.thumbnailUrl,
          544,
          544,
        );
        const obj = {
          ...d,
          ...v,
          author:ytmusic.joinArtists(v.artists)
        };
        newQueue.push(obj);
        if (context.shuffle) {
          console.log('Shuffling');
          const shuffledArray = ytmusic.shuffle(songs.slice(), index);
          newQueue = [...newQueue, ...shuffledArray];
        } else {
          songs.forEach((val, i) => {
            if (i > index) {
              val.thumbnailUrl = ytmusic.manipulateThumbnailUrl(
                val.thumbnailUrl,
                544,
                544,
              );
              newQueue.push({
                ...val,
                author: ytmusic.joinArtists(val.artists),
              });
            }
          });
        }
        context.setVideoQueue(newQueue);
        context.setNowPlaying(obj);
        context.setIndex(0);
      });
    }
  };

  return (
    <View
      style={[
        {backgroundColor: scheme.colorBg},
        StyleSheet.absoluteFillObject,
      ]}>
      <AnimatedLinearGradient
        colors={[dominantColor?.primary || '#363636', '#fff0']}
        start={{x: 0, y: 0}}
        end={{x: 0.5, y: 0.5}}
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: IMAGE_SIZE * 2,
          position: 'absolute',
          opacity: gradientVisibility,
        }}
      />
      <AnimatedLinearGradient
        colors={[dominantColor?.secondary || '#363636', '#fff0']}
        start={{x: 1, y: 0}}
        end={{x: 0.5, y: 0.5}}
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: IMAGE_SIZE * 2,
          position: 'absolute',
          opacity: gradientVisibility,
        }}
      />
      <Animated.View
        style={{
          width,
          alignItems: 'center',
          zIndex: 1,
          position: 'absolute',
        }}>
        <AnimatedLinearGradient
          colors={['#E3AF3400', '#E3AF34FF']}
          style={[
            styles.shuffle_button,
            {
              width: IMAGE_SIZE - 15,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, IMAGE_SIZE, IMAGE_SIZE + 1],
                    outputRange: [
                      IMAGE_SIZE + 130,
                      StatusBar.currentHeight + 10,
                      StatusBar.currentHeight + 10,
                    ],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              play(0);
            }}
            style={{width: '100%', height: '100%'}}>
            <CustomText
              numberOfLines={1}
              style={{
                fontSize: 25,
                color: scheme.textColor,
                textShadowColor: '#000',
                textShadowRadius: 15,
                textAlign: 'center',
              }}>
              Magick trick
            </CustomText>
          </TouchableOpacity>
        </AnimatedLinearGradient>
      </Animated.View>
      <View style={styles.metadata}>
        <Animated.View
          style={{
            alignItems: 'center',
            flexDirection: 'column',
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, IMAGE_SIZE + 200, IMAGE_SIZE + 201],
                  outputRange: [0, -500, -500],
                }),
              },
              {
                scale: scrollY.interpolate({
                  inputRange: [0, IMAGE_SIZE + 200, IMAGE_SIZE + 201],
                  outputRange: [1, 0.4, 0.4],
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, IMAGE_SIZE, IMAGE_SIZE],
              outputRange: [1, 0, 0],
            }),
          }}>
          <SharedElement id={`${route.params.data?.playlistId}.thumbnail`}>
            <Image
              source={{uri: route.params.data?.thumbnailUrl}}
              style={{width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius:10, resizeMode:'contain'}}
              borderRadius={10}
              resizeMode={'contain'}
            />
          </SharedElement>
            <TextTicker numberOfLines={1} loop duration={20000} marqueeDelay={3000} easing={Easing.linear} bounce={false} style={[styles.metadata_title]}>
              {route.params.data?.title}
            </TextTicker>
          {route.params.data?.totalSongs && <CustomText style={styles.metadata_year}>
            {route.params.data?.totalSongs + ' songs'}
          </CustomText>}
        </Animated.View>
      </View>
      <Animated.ScrollView
        scrollEventThrottle={1}
        contentContainerStyle={{
          paddingTop: IMAGE_SIZE + 200,
          paddingBottom: 120,
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: true,
            listener: e => {
              Animated.timing(gradientVisibility, {
                toValue: e.nativeEvent.contentOffset.y > 20 ? 0 : 1,
                duration: 600,
                useNativeDriver: true,
              }).start();
            },
          },
        )}>
        {songs?.length > 0 ? (
          songs?.map((v, i) => (
            <TouchableOpacity
              key={`${v.youtubeId}${v.title}playlist${i}`}
              onPress={e => {
                play(i);
              }}>
              <SongPreview data={v} index={i} />
            </TouchableOpacity>
          ))
        ) : (
          <Loading />
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  metadata: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: StatusBar.currentHeight + 15,
    alignItems: 'center',
    flexDirection: 'column',
  },
  metadata_title: {
    padding: 10,
    color: scheme.textColor,
    fontSize: 25,
    fontWeight: '800',
  },
  metadata_year: {
    fontSize: 15,
    fontWeight: '300',
    color: scheme.textColor,
    opacity: 0.7,
  },
  shuffle_button: {
    backgroundColor: scheme.colorPrimary,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
