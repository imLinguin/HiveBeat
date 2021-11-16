import React from 'react';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/core';
import scheme from '../assets/scheme';
import CustomText from './CustomText';
import {SharedElement} from 'react-navigation-shared-element';

export default function ArtistPreview({data}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('Artist', {id: data.artistId, ...data});
      }}
      style={{
        width: 150,
        marginVertical: 5,
        marginHorizontal: 10,
        alignItems: 'center',
      }}>
      <SharedElement id={`${data.artistId}.artistthumbnail`}>
        <Image
          source={{uri: data.thumbnailUrl}}
          borderRadius={100}
          style={{width: 150, height: 150}}
        />
      </SharedElement>
      <CustomText
        style={{
          color: scheme.textColor,
          fontWeight: '800',
          paddingTop: 5,
          textAlign: 'center',
        }}>
        {data.name}
      </CustomText>
    </TouchableOpacity>
  );
}
