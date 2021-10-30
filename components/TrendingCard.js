import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import scheme from '../assets/scheme';
import ytm from '../api/ytmusic';
import useStore from '../context';
import CustomText from './CustomText';
export default function TrendingCard({listProps, style}) {
  const setNowPlaying = useStore(state=>state.setNowPlaying);
  return (
    <TouchableOpacity
      style={{...styles.wrapper, ...style}}
      onPress={() => {
        ytm.getVideoData(listProps.item.videoId).then(data=>{
          data.title && setNowPlaying(data);
        });
        
      }}>
      <Image
        source={{uri: listProps.item.videoThumbnails[0].url}}
        style={{width: 160, height: 90}}
      />
      <View style={styles.dataWrapper}>
        <CustomText style={styles.titleText}>{listProps.item.title}</CustomText>
        <CustomText style={styles.authorText}>{listProps.item.author}</CustomText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  dataWrapper: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
  },
  titleText: {
    width: 200,
    color: scheme.textColor,
    fontSize: 16,
  },
  authorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
});
