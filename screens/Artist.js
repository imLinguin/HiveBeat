import React, {useEffect, useState, useRef} from 'react';
import {
  Animated,
  Image,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import AlbumPreview from '../components/AlbumPreview';
import ArtistPreview from '../components/ArtistPreview';
import SongPreview from '../components/SongPreview';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import Loading from '../components/Loading';
import ArtistCategory from '../components/ArtistCategory';
import CustomText from '../components/CustomText';
import shallow from 'zustand/shallow';
import {SharedElement} from 'react-navigation-shared-element';
import {getColorFromURL} from 'rn-dominant-color';
import useStore from '../context';
import {determineDark} from '../api/utils';
import LinearGradient from 'react-native-linear-gradient';

function Artist({route, id, navigation}) {
  const {setPaused, setNowPlaying, setVideoQueue, nowPlaying, setIndex} =
    useStore(
      state => ({
        setPaused: state.setPaused,
        setIndex: state.setIndex,
        setNowPlaying: state.setNowPlaying,
        setVideoQueue: state.setVideoQueue,
        nowPlaying: state.nowPlaying,
      }),
      shallow,
    );
  const [artist, setArtist] = useState(null);
  const [dominantColor, setDominantColor] = useState('#363636FF');
  const {width, height} = useWindowDimensions();
  const scrollY = useRef(new Animated.Value(0)).current;
  const AnimatedCustomText = Animated.createAnimatedComponent(CustomText);
  useEffect(() => {
    if (artist) return;
    ytmusic.getArtistData(route.params.id).then(artistData => {
      if (artistData) {
        artistData.thumbnailUrl = ytmusic.manipulateThumbnailUrl(
          artistData?.thumbnails[0].url,
          500,
          500,
        );
        setArtist(artistData);
        getColorFromURL(artistData.thumbnailUrl).then(v => {
          if (v) {
            v.textColor = determineDark(v.primary);
            setDominantColor(v);
          }
        });
      }
    });
  }, []);
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: scheme.colorBg,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          position: 'absolute',
          paddingTop: StatusBar.currentHeight + 10,
          top: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          shadowColor: '#0000',
        }}>
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: dominantColor?.primary,
              opacity: scrollY.interpolate({
                inputRange: [0, width, width + 1],
                outputRange: [0, 0.8, 0.8],
              }),
            },
          ]}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('../assets/Back.png')}
            style={{padding: 10, margin: 10, width: 20, height: 35}}
          />
        </TouchableOpacity>
        <AnimatedCustomText
          numberOfLines={1}
          style={{
            color: dominantColor.textColor,
            fontWeight: '700',
            fontSize: 25,
            elevation: 1,
            marginLeft: 20,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [0, width, width + 1],
                  outputRange: [10, 0, 0],
                }),
              },
            ],
            opacity: scrollY.interpolate({
              inputRange: [0, width],
              outputRange: [0, 1],
            }),
          }}>
          {artist?.name}
        </AnimatedCustomText>
      </View>

      {artist ? (
        <Animated.ScrollView
          style={{backgroundColor: scheme.colorBg}}
          contentContainerStyle={{paddingBottom: 120}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollY}}}],
            {useNativeDriver: true},
          )}>
          <View style={{height, width, position: 'absolute'}}>
            <Image
              source={require('../assets/HeaderBackground.png')}
              style={{width: '100%', height}}
            />
            <LinearGradient
              colors={['#fffa', '#fff0']}
              start={{x: 0.5, y: -0.3}}
              end={{x: 0.5, y: 0.15}}
              style={{width: '100%', height, position:'absolute'}}
            />
          </View>

          <View
            style={{
              width,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: StatusBar.currentHeight + 50,
              marginBottom: 20,
            }}>
            <SharedElement id={`${artist?.songsPlaylistId}.thumbnail`}>
              <Image
                style={{
                  width: width / 2,
                  height: width / 2,
                  opacity: 1,
                  borderRadius: width / 2,
                  borderColor: '#fff',
                  borderWidth: 4,
                }}
                resizeMode={'cover'}
                source={{uri: artist && artist.thumbnailUrl}}
              />
            </SharedElement>
            <CustomText
              style={{
                fontSize: 32,
                fontWeight: '800',
                color: scheme.textColor,
                width: width,
                textShadowColor: '#000',
                textShadowOffset: {width: 0, height: 0},
                textShadowRadius: 25,
                textAlign: 'center',
              }}>
              {artist?.name}
            </CustomText>
          </View>
          <ArtistCategory title={'Songs'}>
            {artist?.featuredSongs &&
              artist.featuredSongs.map((v, i) => (
                <TouchableOpacity
                  key={`${v.youtubeId}${i}artist_${artist.id}`}
                  onPress={() => {
                    setPaused(true);
                    if (nowPlaying?.youtubeId !== v.youtubeId)
                      ytmusic.getVideoData(v.youtubeId).then(d => {
                        const obj = {
                          ...v,
                          ...d,
                          author: ytmusic.joinArtists(v.artists),
                          thumbnailUrl: ytmusic.manipulateThumbnailUrl(
                            v.thumbnailUrl,
                            544,
                            544,
                          ),
                        };
                        setVideoQueue([obj]);
                        setIndex(0);
                        setNowPlaying(obj);
                      });
                  }}>
                  <SongPreview data={v} index={i} />
                </TouchableOpacity>
              ))}
          </ArtistCategory>
          {artist.songsPlaylistId && (
            <TouchableOpacity
              onPress={() => {
                navigation.push('Playlist', {
                  data: {
                    playlistId: artist.songsPlaylistId,
                    thumbnailUrl: artist.thumbnailUrl,
                    title: `${artist.name} Songs`,
                  },
                });
              }}>
              <CustomText
                style={{
                  marginLeft: 10,
                  marginBottom: 20,
                  fontSize: 30,
                  fontWeight: '600',
                  color: scheme.colorPrimary,
                }}>
                See All
              </CustomText>
            </TouchableOpacity>
          )}
          {artist?.albums?.length > 0 && (
            <ArtistCategory title={'Albums'}>
              <FlatList
                data={artist?.albums}
                style={{
                  width: '100%',
                  marginVertical: 10,
                  textShadowColor: '#000',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 25,
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={item => item.albumId}
                renderItem={({item}) => (
                  <AlbumPreview
                    data={item}
                    navigation={navigation}
                    artist={artist}
                  />
                )}
              />
            </ArtistCategory>
          )}
          {artist?.singles?.length > 0 && (
            <ArtistCategory title={'Singles'} flatListData={artist?.singles}>
              <FlatList
                data={artist?.singles}
                style={{
                  width: '100%',
                  marginVertical: 10,
                  textShadowColor: '#000',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 25,
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={item => item.albumId}
                renderItem={({item}) => (
                  <AlbumPreview
                    data={item}
                    navigation={navigation}
                    artist={artist}
                  />
                )}
              />
            </ArtistCategory>
          )}
          {artist?.suggestedArtists?.length > 0 && (
            <ArtistCategory title={'Suggested Artists'}>
              <FlatList
                data={artist?.suggestedArtists}
                style={{
                  width: '100%',
                  height: 200,
                  marginVertical: 5,
                  textShadowColor: '#000',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 25,
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                keyExtractor={item => item.artistId}
                renderItem={({item}) => (
                  <ArtistPreview data={item} navigation={navigation} />
                )}
              />
            </ArtistCategory>
          )}
          {artist?.description && (
            <ArtistCategory title={'Description'}>
              <CustomText
                style={{
                  fontSize: 15,
                  fontWeight: '400',
                  color: scheme.textColor,
                  width: '100%',
                  textShadowColor: '#000',
                  textShadowOffset: {width: 0, height: 0},
                  textShadowRadius: 25,
                  padding: 10,
                }}>
                {artist?.description}
              </CustomText>
            </ArtistCategory>
          )}
        </Animated.ScrollView>
      ) : (
        <Loading
          style={[
            {
              width,
              height,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: scheme.colorBg,
            },
          ]}
        />
      )}
    </View>
  );
}

Artist.sharedElements = (route, other) => {
  const {data} = other.params;
  const id = data?.playlistId || data?.albumId || data?.artistId;
  return [`${id}.thumbnail`];
};

export default Artist;
