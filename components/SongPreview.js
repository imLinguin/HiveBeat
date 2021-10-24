import React, {useContext, useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import scheme from '../assets/scheme';
import {videoContext} from '../context';
import CustomText from './CustomText';

export default function SongPreview({data, index}) {
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
        <CustomText style={{color: isPlaying ? scheme.colorPrimary : scheme.textColor, fontWeight:'600', width: 25, textAlign:'left'}}>
          {index+1}
        </CustomText>
        <Image
          source={{uri: data.thumbnailUrl}}
          style={{width: 70, height: 70}}
          borderRadius={5}
        />
        <CustomText
          numberOfLines={3}
          style={{
            color: isPlaying ? scheme.colorPrimary : scheme.textColor,
            fontWeight: '600',
            paddingHorizontal: 15,
            fontSize: 15,
            width: '65%'
          }}>
          {data.title}
        </CustomText>
      </View>
      <CustomText style={{color: scheme.textColor, fontWeight: '200', fontSize: 15}}>
        {data.duration.label}
      </CustomText>
    </View>
  );
}
