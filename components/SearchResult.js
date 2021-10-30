import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import scheme from '../assets/scheme';
import ytm from '../api/ytmusic';
import useStore from '../context';
import shallow from 'zustand/shallow'
import CustomText from './CustomText';
export default function TrendingCard({listProps, style}) {
  const {nowPlaying, setNowPlaying, setVideoQueue, resetIndex, setPaused} = useStore(state => ({
    nowPlaying: state.nowPlaying,
    setNowPlaying: state.setNowPlaying,
    setVideoQueue: state.setVideoQueue,
    resetIndex: state.resetIndex,
    setPaused: state.setPaused
  }), shallow);
  const [isPrimary, setPrimary] = React.useState('rgba(255,255,255,0.8)');
  const [artistsText, setArtists] = React.useState('');
  React.useEffect(() => {
    setPrimary(
      listProps.youtubeId === nowPlaying?.id
        ? scheme.colorPrimary
        : 'rgba(255,255,255,0.8)',
    );
    setArtists(ytm.joinArtists(listProps.artists));
  }, [nowPlaying.id]);
  return (
    <TouchableOpacity
      style={{...styles.wrapper, ...style, borderColor: isPrimary}}
      onPress={() => {
        setPaused(true);
        if (nowPlaying.id !== listProps.youtubeId)
          ytm.getVideoData(listProps.youtubeId).then(data => {
            listProps.thumbnailUrl = ytm.manipulateThumbnailUrl(
              listProps.thumbnailUrl,
              544,
              544,
            );
            let nowPlayingObj = {...listProps, ...data, author: artistsText};
            ytm.musicSuggestions(listProps.youtubeId).then(dat => {
              dat[0] = nowPlayingObj;
              dat.length > 0 && setVideoQueue(dat);
              data.lengthSeconds && setNowPlaying(nowPlayingObj);
              resetIndex(0);
            });
          });
      }}>
      <Image
        source={{uri: listProps.thumbnailUrl}}
        style={{width: 150, height: 150}}
        borderRadius={15}
        resizeMode={'cover'}
      />
      <View style={styles.dataWrapper}>
        <CustomText style={{...styles.titleText, color: isPrimary}}>
          {listProps.title}
        </CustomText>
        <CustomText style={styles.authorText}>{artistsText}</CustomText>
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
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  dataWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 10,
    justifyContent: 'center',
  },
  titleText: {
    color: scheme.textColor,
    fontSize: 16,
    textAlign: 'center',
  },
  authorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
});
