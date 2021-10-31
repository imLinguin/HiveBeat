import React from 'react';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SharedElement} from 'react-navigation-shared-element';

import {useNavigation} from '@react-navigation/core';
import scheme from '../assets/scheme';
import CustomText from './CustomText';

export default function PlaylistPreview({data}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('Playlist', {data, id: data.playlistId});
      }}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginHorizontal: 15,
        marginTop: 5,
        paddingTop: 10,
        width: 150,
      }}>
      <SharedElement id={`${data.playlistId}.thumbnail`}>
        <Image
          source={{uri: data.thumbnailUrl}}
          borderRadius={10}
          style={{width: 150, height: 150, resizeMode:'contain'}}
          resizeMode={'contain'}
        />
      </SharedElement>
        <CustomText
          numberOfLines={2}
          style={{
            fontSize: 15,
            fontWeight:"800",
            textAlign: 'center',
            color: scheme.textColor,
            paddingVertical: 10,
          }}>
          {data.title}
        </CustomText>
    </TouchableOpacity>
  );
}
