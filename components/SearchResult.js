import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import scheme from '../assets/scheme';
import ytm from '../api/ytmusic';
import {videoContext} from '../context';
export default function TrendingCard({listProps, style}) {
  const {nowPlaying, setNowPlaying} = React.useContext(videoContext);
  const isPrimary = listProps.videoId === nowPlaying?.videoId ? scheme.colorPrimary : 'rgba(255,255,255,0.8)'
  return (
    <TouchableOpacity
      style={{...styles.wrapper, ...style, borderColor: isPrimary}}
      onPress={() => {
        ytm.getVideoData(listProps.videoId).then(data=>{
          data.title && setNowPlaying(data);
        });
      }}>
      <Image
        source={{uri: listProps.videoThumbnails[0].url}}
        style={{width: 150, height: 150, borderRadius: 15}}
        resizeMode={'cover'}
      />
      <View style={styles.dataWrapper}>
        <Text style={{...styles.titleText, color: isPrimary}}>{listProps.title}</Text>
        <Text style={styles.authorText}>{listProps.author}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    width: '45%',
    paddingTop: 15,
    margin:5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  dataWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 10,
    justifyContent:'center'
  },
  titleText: {
    color: scheme.textColor,
    fontSize: 16,
    textAlign:'center'
  },
  authorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign:'center'
  },
});
