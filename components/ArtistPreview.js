import React from 'react';
import {Text, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/core';
import scheme from '../assets/scheme';

export default function ArtistPreview({data}) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push('Artist', {id: data.artistId});
      }}
      style={{
        height: '100%',
        width: 150,
        marginHorizontal: 10,
        alignItems: 'center',
      }}>
      <Image
        source={{uri: data.thumbnailUrl}}
        borderRadius={100}
        style={{width: 150, height: 150}}
      />
      <Text
        style={{
          color: scheme.textColor,
          fontWeight: '800',
          paddingTop: 5,
          textAlign: 'center',
        }}>
        {data.name}
      </Text>
    </TouchableOpacity>
  );
}
