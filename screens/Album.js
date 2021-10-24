import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  Animated,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SongPreview from '../components/SongPreview';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import {videoContext} from '../context';
import CustomText from '../components/CustomText';
import LinearGradient from 'react-native-linear-gradient';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function Album({route}) {
  const context = useContext(videoContext);
  const [songs, setSongs] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const {width, height} = useWindowDimensions();
  const IMAGE_SIZE = width / 1.6;
  useEffect(() => {
    if (songs) return;
    ytmusic.getAlbumSongs(route.params.data.albumId).then(albumData => {
      if (albumData) {
        setSongs(albumData);
      }
    });
  }, []);

  const play = (index) => {
    const v = songs[index]
    ytmusic.getVideoData(v.youtubeId).then(d => {
      let newQueue = [];
      v.thumbnailUrl = ytmusic.manipulateThumbnailUrl(v.thumbnailUrl, 544, 544);
      const obj = {
        ...d,
        ...v,
        artists: [
          {
            name: route.params.artist.name,
            id: route.params.artist.id,
          },
        ],
        author: route.params.artist.name,
      };
      newQueue.push(obj);
      console.log(context.shuffle);
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
              artists: [
                {
                  name: route.params.artist.name,
                  id: route.params.artist.id,
                },
              ],
              author: route.params.artist.name,
            });
          }
        });
      }
      context.setNowPlaying(obj);
      context.setVideoQueue(newQueue);
      context.setNowPlayingIndex(0);
      context.setPaused(false);
    });
  };

  return (
    <View style={{backgroundColor: scheme.colorBg}}>
      <LinearGradient
        colors={['#fffC', '#fff0']}
        start={{x: 0, y: 0}}
        end={{x: 0.2, y: 0.25}}
        style={StyleSheet.absoluteFillObject}
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
          <Image
            source={{uri: route.params.data?.thumbnailUrl}}
            style={{width: IMAGE_SIZE, height: IMAGE_SIZE}}
            borderRadius={10}
          />
          <CustomText style={styles.metadata_title}>
            {route.params.data?.title}
          </CustomText>
          <CustomText style={styles.metadata_year}>
            {route.params.data?.year}
          </CustomText>
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
          },
        )}>
        {songs?.map((v, i) => (
          <TouchableOpacity
            key={`${v.youtubeId}${v.title}albumList`}
            onPress={e => {play(i)}}>
            <SongPreview data={v} index={i} />
          </TouchableOpacity>
        ))}
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
