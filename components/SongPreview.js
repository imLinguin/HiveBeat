import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import scheme from '../assets/scheme';
import {videoContext} from '../context';

export default function SongPreview({data}) {
  const context = useContext(videoContext);
  const [isPlaying, setPlaying] = useState(false);
  useEffect(() => {
    setPlaying(data.youtubeId === context.nowPlaying.youtubeId);
  }, [context.nowPlaying]);
  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          source={{uri: data.thumbnailUrl}}
          style={{width: 70, height: 70}}
        />
        <Text
          numberOfLines={3}
          style={{
            color: isPlaying ? scheme.colorPrimary : scheme.textColor,
            fontWeight: '600',
            paddingHorizontal: 15,
            fontSize: 15,
            width: '70%'
          }}>
          {data.title}
        </Text>
      </View>
      <Text style={{color: scheme.textColor, fontWeight: '200', fontSize: 15}}>
        {data.duration.label}
      </Text>
    </View>
  );
}
