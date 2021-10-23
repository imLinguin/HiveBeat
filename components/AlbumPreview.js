import React from 'react';
import {View, Text, Image} from 'react-native';
import scheme from '../assets/scheme';

export default function AlbumPreview({data}) {
  return (
    <View style={{width: 150, marginHorizontal: 5, alignItems:'center'}}>
      <Image
        source={{uri: data.thumbnailUrl}}
        style={{width: 140, height: 140}}
        borderRadius={15}
      />
      <Text
        style={{
          paddingTop: 5,
          color: scheme.textColor,
          fontWeight: '800',
          textAlign: 'center',
        }}>
        {data.title}
      </Text>
    </View>
  );
}