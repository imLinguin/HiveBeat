import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
  Animated,
} from 'react-native';
import scheme from '../assets/scheme';
import ytm from '../api/ytmusic';
import useStore from '../context';
import shallow from 'zustand/shallow';
import CustomText from './CustomText';
import Loading from './Loading';
import {SharedElement} from 'react-navigation-shared-element';

export function Song({listProps, style, index}) {
  const {
    nowPlaying,
    setNowPlaying,
    setVideoQueue,
    resetIndex,
    setPaused,
    setPlayingFrom,
  } = useStore(
    state => ({
      nowPlaying: state.nowPlaying,
      setNowPlaying: state.setNowPlaying,
      setVideoQueue: state.setVideoQueue,
      resetIndex: state.resetIndex,
      setPaused: state.setPaused,
      setPlayingFrom: state.setPlayingFrom,
    }),
    shallow,
  );
  const [isPrimary, setPrimary] = React.useState('rgba(255,255,255,1)');
  const [loading, setLoading] = React.useState(false);
  const [artistsText, setArtists] = React.useState('');

  const animatedFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedFade, {
      duration: 500 + index * 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animatedFade, index]);

  React.useEffect(() => {
    setPrimary(
      listProps.youtubeId === nowPlaying?.youtubeId
        ? scheme.colorPrimary
        : 'rgba(255,255,255,1)',
    );
    setArtists(ytm.joinArtists(listProps.artists));
  }, [listProps.artists, listProps.youtubeId, nowPlaying?.youtubeId]);

  return (
    <Animated.View style={{opacity: animatedFade}}>
      <TouchableOpacity
        style={{
          ...styles.wrapper,
          ...style,
          borderColor: isPrimary,
        }}
        onPress={() => {
          if (nowPlaying?.youtubeId !== listProps.youtubeId) {
            setPaused(true);
            setLoading(true);
            setPrimary(scheme.colorPrimary);
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
                data.lengthSeconds && resetIndex();
                data.lengthSeconds && setNowPlaying(nowPlayingObj);
                setPlayingFrom({});
                setLoading(false);
              });
            });
          } else {
            ToastAndroid.showWithGravity(
              'Already playing',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }
        }}>
        <View>
          <Animated.Image
            source={{uri: listProps.thumbnailUrl}}
            style={styles.image}
            borderRadius={10}
            resizeMode={'contain'}
          />
          {loading && (
            <Loading
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          )}
        </View>
        <View style={styles.dataWrapper}>
          <CustomText
            style={{...styles.titleText, color: isPrimary, fontWeight: '700'}}>
            {listProps.title}
          </CustomText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText style={styles.authorText}>
              Song • {artistsText}
            </CustomText>
            {listProps.isExplicit && (
              <View style={styles.explicit}>
                <CustomText style={{color: 'black', fontWeight: '700'}}>
                  E
                </CustomText>
              </View>
            )}
          </View>
        </View>
        <View>
          <CustomText style={{color: isPrimary, fontWeight: '100'}}>
            {listProps.duration.label}
          </CustomText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function Album({listProps, navigation, index}) {
  const [isPrimary, setPrimary] = React.useState('rgba(255,255,255,0.8)');
  const animatedFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedFade, {
      duration: 500 + index * 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animatedFade, index]);
  // TODO: Detecting if its being played from that Album
  return (
    <Animated.View style={{opacity: animatedFade}}>
      <TouchableOpacity
        style={{...styles.wrapper, borderColor: isPrimary}}
        onPress={() => {
          navigation.push('Album', {data: listProps, id: listProps.albumId});
        }}>
        <SharedElement id={`${listProps.albumId}.thumbnail`}>
          <Animated.Image
            source={{uri: listProps.thumbnailUrl}}
            style={{...styles.image, resizeMode: 'contain'}}
            borderRadius={10}
          />
        </SharedElement>
        <View style={styles.dataWrapper}>
          <CustomText
            numberOfLines={1}
            style={{
              ...styles.titleText,
            }}>
            {listProps.title}
          </CustomText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText style={styles.authorText}>
              Album • {listProps.artist} • {listProps.year}
            </CustomText>
            {listProps.isExplicit && (
              <View style={styles.explicit}>
                <CustomText style={{color: 'black', fontWeight: '700'}}>
                  E
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function Artist({listProps, navigation, index}) {
  const animatedFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedFade, {
      duration: 500 + index * 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animatedFade, index]);
  return (
    <Animated.View style={{opacity: animatedFade}}>
      <TouchableOpacity
        style={{...styles.wrapper, borderColor: 'transparent'}}
        onPress={() => {
          navigation.push('Artist', {id: listProps.artistId, ...listProps});
        }}>
        <SharedElement id={`${listProps.artistId}.artistthumbnail`}>
          <Animated.Image
            source={{uri: listProps.thumbnailUrl}}
            style={{...styles.image, borderRadius: 100}}
          />
        </SharedElement>
        <View style={styles.dataWrapper}>
          <CustomText style={styles.titleText}>{listProps.name}</CustomText>
          <CustomText style={{fontSize: 13, fontWeight: '200'}}>
            Artist
          </CustomText>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function Playlist({listProps, navigation, index}) {
  const [isPrimary, setPrimary] = React.useState('rgba(255,255,255,0.8)');
  const animatedFade = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedFade, {
      duration: 500 + index * 200,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [animatedFade, index]);
  // TODO: Detecting if its being played from that Album
  return (
    <Animated.View style={{opacity: animatedFade}}>
      <TouchableOpacity
        style={{...styles.wrapper, borderColor: isPrimary}}
        onPress={() => {
          navigation.push('Playlist', {
            data: listProps,
            id: listProps.playlistId,
          });
        }}>
        <SharedElement id={`${listProps.playlistId}.thumbnail`}>
          <Animated.Image
            source={{uri: listProps.thumbnailUrl}}
            style={{...styles.image, resizeMode: 'contain', borderRadius: 10}}
            borderRadius={10}
          />
        </SharedElement>
        <View style={styles.dataWrapper}>
          <CustomText
            numberOfLines={1}
            style={{
              ...styles.titleText,
            }}>
            {listProps.title}
          </CustomText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText style={{fontWeight: '200'}}>Playlist</CustomText>
            {listProps.isExplicit && (
              <View style={styles.explicit}>
                <CustomText style={{color: 'black', fontWeight: '700'}}>
                  E
                </CustomText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '95%',
    margin: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  image: {
    width: 70,
    height: 70,
    marginVertical: 10,
    borderRadius: 10,
  },
  dataWrapper: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: 'flex-start',
  },
  titleText: {
    color: scheme.textColor,
    fontSize: 16,
    paddingTop: 5,
    fontWeight: '800',
    textAlign: 'left',
  },
  authorText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'left',
    fontWeight: '300',
  },
  explicit: {
    margin: 5,
    backgroundColor: '#fff6',
    width: 20,
    height: 20,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
