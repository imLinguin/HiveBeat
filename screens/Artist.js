import React, {useEffect, useState} from 'react';
import {Image, ScrollView, StatusBar, View} from 'react-native';
import AlbumPreview from '../components/AlbumPreview';
import ArtistPreview from '../components/ArtistPreview';
import {FlatList} from 'react-native-gesture-handler';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import Loading from '../components/Loading';
import ArtistCategory from '../components/ArtistCategory';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../components/CustomText';

export default function Artist({route, id, navigation}) {
  const [artist, setArtist] = useState(null);
  useEffect(() => {
    if (artist) return;
    ytmusic.getArtistData(route.params.id).then(artistData => {
      if (artistData) {
        setArtist(artistData);
      }
    });
  }, []);
  return (
    <ScrollView
      style={{backgroundColor: scheme.colorBg}}
      contentContainerStyle={{paddingBottom: 120}}>
      <View>
        <Image
          style={{
            marginTop: StatusBar.currentHeight,
            width: '100%',
            height: 225,
            opacity: 0.7,
          }}
          resizeMode={'cover'}
          source={{uri: artist && artist?.thumbnails[1].url}}
        />
        <LinearGradient colors={["#36363600", "#363636FF"]} end={{x:0.5, y:1}} style={{position:'absolute', width:'100%', height:225, top:StatusBar.currentHeight}}/>
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
            textAlign:'center',
            right:5,
            bottom: 15,
          }}>
          {artist?.name}
        </CustomText>
      </View>
      {artist ? (
        <>
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
          {artist?.description && <ArtistCategory title={'Description'}>
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
          </ArtistCategory>}
        </>
      ) : (
        <Loading />
      )}
    </ScrollView>
  );
}
