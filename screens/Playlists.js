import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  Image,
} from 'react-native';
import scheme from '../assets/scheme';
import CustomText from '../components/CustomText';
import {useAsyncStorage} from '@react-native-async-storage/async-storage';

import PlaylistsHeader from '../components/PlaylistsHeader';
import useStore from '../context';

export default function Playlists({navigation}) {
  const context = useStore(store => ({
    playlistModalvisible: store.playlistModalVisible,
    switchPlaylistModalVisibility: store.switchPlaylistModalVisibility,
  }));
  const {width, height} = useWindowDimensions();
  const [playlists, setPlaylists] = useState([]);
  const storage = useAsyncStorage('playlists');
  useEffect(() => {
    storage.getItem((err, value) => {
      if (!err && value) {
        setPlaylists(JSON.parse(value));
        console.log(playlists.length);
      }
    });
  }, [context.playlistModalvisible, playlists.length, storage]);
  const styles = StyleSheet.create({
    wrapper: {
      backgroundColor: scheme.colorBg,
      width,
      height,
    },
    playlists: {
      zIndex: 2,
    },
  });
  return (
    <ScrollView
      style={styles.wrapper}
      contentContainerStyle={{minHeight: height}}>
      <PlaylistsHeader navigation={navigation} context={context} />
      <Image
        source={require('../assets/HeaderBackground.png')}
        style={{
          width: '100%',
          height,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      />
      <View style={styles.playlists}>
        {playlists.length > 0 &&
          playlists.map((item, index) => (
            <CustomText key={index + 'playlists'}>{item.name}</CustomText>
          ))}
      </View>
    </ScrollView>
  );
}
