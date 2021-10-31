import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StatusBar, View} from 'react-native';
import AlbumPreview from '../components/AlbumPreview';
import ArtistPreview from '../components/ArtistPreview';
import SongPreview from '../components/SongPreview';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import Loading from '../components/Loading';
import ArtistCategory from '../components/ArtistCategory';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../components/CustomText';
import shallow from 'zustand/shallow';
import {SharedElement} from 'react-navigation-shared-element'
import { getColorFromURL } from 'rn-dominant-color'; 
import useStore from '../context';

function Artist({route, id, navigation}) {
  const {setPaused, setNowPlaying, setVideoQueue, nowPlaying, setIndex} = useStore(state => ({
    setPaused: state.setPaused,
    setIndex: state.setIndex,
    setNowPlaying: state.setNowPlaying,
    setVideoQueue: state.setVideoQueue,
    nowPlaying: state.nowPlaying
  }), shallow)
  const [artist, setArtist] = useState(null);
  const [dominantColor, setDominantColor] = useState("#363636FF");
  useEffect(() => {
    if (artist) return;
    ytmusic.getArtistData(route.params.id).then(artistData => {
      if (artistData) {
        artistData.thumbnailUrl = ytmusic.manipulateThumbnailUrl(artistData?.thumbnails[0].url, 500,500);
        setArtist(artistData);
        getColorFromURL(artistData.thumbnailUrl).then((v)=>{
          if(v) {
            setDominantColor(v.primary);
          }
        })
      }
    });
  }, []);
  return (
    <ScrollView
      style={{backgroundColor: scheme.colorBg}}
      contentContainerStyle={{paddingBottom: 120}}>
      <View>
        <SharedElement id={`${artist?.songsPlaylistId}.thumbnail`}>
        <Image
          style={{
            width: '100%',
            height: 300,
            opacity: 0.7,
          }}
          resizeMode={'cover'}
          source={{uri: artist && artist.thumbnailUrl}}
        />
        </SharedElement>
        <LinearGradient
          colors={[dominantColor, '#36363600', '#363636FF']}
          start={{x:0.5, y:-0.3}}
          end={{x: 0.5, y: 0.85}}
          style={{
            position: 'absolute',
            width: '100%',
            height: 300+StatusBar.currentHeight,
            top: 0,
          }}
        />
        <CustomText
          style={{
            fontSize: 32,
            fontWeight: '800',
            color: scheme.textColor,
            position: 'absolute',
            width: '100%',
            textShadowColor: '#000',
            textShadowOffset: {width: 0, height: 0},
            textShadowRadius: 25,
            left: 5,
            textAlign: 'center',
            right: 5,
            bottom: 15,
          }}>
          {artist?.name}
        </CustomText>
      </View>
      {artist ? (
        <>
          <ArtistCategory title={'Songs'}>
            {artist?.featuredSongs &&
              artist.featuredSongs.map((v, i) => (
                <TouchableOpacity key={`${v.youtubeId}${i}artist_${artist.id}`} onPress={()=>{
                  setPaused(true);
                  if(nowPlaying.id !== v.youtubeId)
                  ytmusic.getVideoData(v.youtubeId).then(d=>{
                    const obj = {
                      ...v,
                      ...d,
                      author: ytmusic.joinArtists(v.artists),
                      thumbnailUrl: ytmusic.manipulateThumbnailUrl(v.thumbnailUrl, 544,544)
                    }
                    setNowPlaying(obj)
                    setIndex(0);
                    setVideoQueue([obj])
                    setPaused(false);
                  })
                }}>
                  <SongPreview
                    data={v}
                    index={i}
                  />
                </TouchableOpacity>
              ))}
          </ArtistCategory>
          {artist.songsPlaylistId && 
          <TouchableOpacity onPress={()=>{
            navigation.push('Playlist', {
              data: {
                playlistId: artist.songsPlaylistId,
                thumbnailUrl: artist.thumbnailUrl,
                title: `${artist.name} Songs`,
              },
            });
          }}>
            <CustomText style={{marginLeft:10, marginBottom:20,fontSize:30, fontWeight:"600", color:scheme.colorPrimary}}>See All</CustomText>
            </TouchableOpacity>}
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
        </>
      ) : (
        <Loading />
      )}
    </ScrollView>
  );
}

Artist.sharedElements = (route, other) =>{
  const {data} = other.params;
  const id = data?.playlistId || data?.albumId || data?.artistId;
  return [`${id}.thumbnail`];
}

export default Artist
