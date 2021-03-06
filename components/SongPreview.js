import React, {useEffect, useState} from 'react';
import {View, Image} from 'react-native';
import ytmusic from '../api/ytmusic';
import scheme from '../assets/scheme';
import useStore from '../context';
import CustomText from './CustomText';

export default function SongPreview({data, index}) {
  const nowPlaying = useStore(state => state.nowPlaying);
  const [isPlaying, setPlaying] = useState(false);
  const [author, setAuthor] = useState("");
  useEffect(() => {
    setPlaying(data.youtubeId === nowPlaying?.youtubeId);
    setAuthor(ytmusic.joinArtists(data.artists))
  }, [nowPlaying]);
  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <CustomText
          style={{
            color: isPlaying ? scheme.colorPrimary : scheme.textColor,
            fontWeight: '600',
            width: 25,
            textAlign: 'left',
          }}>
          {index + 1}
        </CustomText>
        <Image
          source={{uri: data.thumbnailUrl}}
          style={{width: 70, height: 70}}
          borderRadius={5}
          resizeMode={'contain'}
        />
        <View
          style={{
            flexDirection: 'column',
            paddingHorizontal: 15,
            width: '65%',
          }}>
          <CustomText
            numberOfLines={3}
            style={{
              color: isPlaying ? scheme.colorPrimary : scheme.textColor,
              fontWeight: '600',
              fontSize: 15,
            }}>
            {data.title}
          </CustomText>
          <CustomText style={{
            fontWeight:'200',
          }}>{author}</CustomText>
        </View>
      </View>
      <CustomText
        style={{color: scheme.textColor, fontWeight: '200', fontSize: 15}}>
        {data.duration && data.duration.label}
      </CustomText>
    </View>
  );
}
