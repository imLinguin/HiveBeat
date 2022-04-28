import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import scheme from '../assets/scheme';
import CustomText from './CustomText';

export default function AlbumPreview({data, navigation, artist, index}) {
  return (
    <TouchableOpacity
      key={`${data.albumId} ${index}`}
      onPress={ev => {
        navigation.navigate('Album', {data});
      }}
      style={{
        width: 150,
        marginHorizontal: 15,
        marginTop: 10,
        alignItems: 'center',
      }}>
      <SharedElement id={`${data.albumId}.thumbnail`}>
        <Image
          source={{uri: data.thumbnailUrl}}
          style={{
            width: 150,
            height: 150,
            borderRadius: 10,
            resizeMode: 'contain',
          }}
          borderRadius={10}
        />
      </SharedElement>
      <CustomText
        style={{
          paddingTop: 5,
          fontSize: 15,
          color: scheme.textColor,
          fontWeight: '800',
          textAlign: 'center',
        }}>
        {data.title}
      </CustomText>
    </TouchableOpacity>
  );
}
