import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import scheme from '../assets/scheme';
import ytm from '../api/ytmusic';
import {videoContext} from '../context';
export default function TrendingCard({listProps, style}) {
  const {nowPlaying, setNowPlaying} = React.useContext(videoContext);
  return (
    <TouchableOpacity
      style={{...styles.wrapper, ...style}}
      onPress={() => {
        ytm.getVideoData(listProps.item.videoId).then(r => {setNowPlaying(r.data)});
      }}>
      <Image
        source={{uri: listProps.item.videoThumbnails[0].url}}
        style={{width: 160, height: 90}}
      />
      <View style={styles.dataWrapper}>
        <Text style={styles.titleText}>{listProps.item.title}</Text>
        <Text style={styles.authorText}>{listProps.item.author}</Text>
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
