import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  useWindowDimensions,
  Animated,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import SongPreview from '../components/SongPreview';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import {videoContext} from '../context';

export default function Album({route}) {
  const context = useContext(videoContext);
  const [songs, setSongs] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const {width, height} = useWindowDimensions();
  const IMAGE_SIZE = width / 2;
  useEffect(() => {
    if (songs) return;
    ytmusic.getAlbumSongs(route.params.data.albumId).then(albumData => {
      if (albumData) {
        setSongs(albumData);
      }
    });
  }, []);

  return (
    <View style={{backgroundColor: scheme.colorBg}}>
      <Animated.View
        style={[
          styles.metadata,
          {
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, IMAGE_SIZE + 100, IMAGE_SIZE + 101],
                  outputRange: [0, -500, -500],
                }),
              },
              {
                scale: scrollY.interpolate({
                  inputRange: [0, IMAGE_SIZE + 100, IMAGE_SIZE + 101],
                  outputRange: [1, 0.4, 0.4],
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, IMAGE_SIZE, IMAGE_SIZE],
              outputRange: [1, 0, 0],
            }),
          },
        ]}>
        <Image
          source={{uri: route.params.data?.thumbnailUrl}}
          style={{width: IMAGE_SIZE, height: IMAGE_SIZE}}
        />
        <Text style={styles.metadata_title}>{route.params.data?.title}</Text>
        <Text style={styles.metadata_year}>{route.params.data?.year}</Text>
      </Animated.View>
      <ScrollView
        contentContainerStyle={{
          paddingTop: IMAGE_SIZE + 130,
          paddingBottom: 120,
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {
            useNativeDriver: false,
          },
        )}>
        {songs?.map((v, i) => (
          <TouchableOpacity
            onPress={e => {
              ytmusic.getVideoData(v.youtubeId).then(d => {
                const newQueue = [];
                v.thumbnailUrl = ytmusic.manipulateThumbnailUrl(
                  v.thumbnailUrl,
                  544,
                  544,
                );
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
                songs.forEach((val, index) => {
                  if (index > i) {
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

                context.setNowPlaying(obj);
                context.setVideoQueue(newQueue);
                context.setNowPlayingIndex(0);
                context.setPaused(false)
              });
            }}>
            <SongPreview data={v} key={`${v.youtubeId}${v.title}albumList`} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
});
