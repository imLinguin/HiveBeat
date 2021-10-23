import React, {useEffect, useState} from 'react';
import {Text, Image, ScrollView, StatusBar, View} from 'react-native';
import AlbumPreview from '../components/AlbumPreview';
import ArtistPreview from '../components/ArtistPreview';
import {FlatList} from 'react-native-gesture-handler';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import Loading from '../components/Loading';

function AlbumCategory({title, flatListData, style}) {
  return (
    <View {...style}>
      <Text
        style={{
          color: scheme.textColor,
          marginHorizontal: 10,
          fontSize: 20,
          fontWeight: '900',
        }}>
        {title}
      </Text>
      <FlatList
        data={flatListData}
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
        renderItem={({item}) => <AlbumPreview data={item} />}
      />
    </View>
  );
}

function ArtistCategory({title, flatListData, style}) {
  return (
    <View {...style}>
      <Text
        style={{
          color: scheme.textColor,
          marginHorizontal: 10,
          fontSize: 20,
          fontWeight: '900',
        }}>
        {title}
      </Text>
      <FlatList
        data={flatListData}
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
        renderItem={({item}) => <ArtistPreview data={item} />}
      />
    </View>
  );
}

export default function Artist({route, id}) {
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
      <Image
        style={{
          marginTop: StatusBar.currentHeight,
          width: '100%',
          height: 225,
          opacity: 0.7,
        }}
        resizeMode={'cover'}
        source={{uri: artist?.thumbnails[1].url}}
      />
      {artist ? (
        <>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: scheme.textColor,
              position: 'absolute',
              width: '100%',
              top: StatusBar.currentHeight + 20,
              textShadowColor: '#000',
              textShadowOffset: {width: 0, height: 0},
              textShadowRadius: 25,
              left: 5,
            }}>
            {artist?.name}
          </Text>
          <AlbumCategory title={'Albums'} flatListData={artist?.albums} />
          <AlbumCategory title={'Singles'} flatListData={artist?.singles} />
          <ArtistCategory
            title={'Suggested Artists'}
            flatListData={artist?.suggestedArtists}
          />
          <Text
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
          </Text>
        </>
      ) : (
        <Loading />
      )}
    </ScrollView>
  );
}
