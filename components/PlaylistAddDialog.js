import React from 'react';
import useStore from '../context';
import Dialog from 'react-native-dialog';
import scheme from '../assets/scheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PlaylistAddDialog() {
  const {visible, setVisible} = useStore(store => ({
    visible: store.playlistModalVisible,
    setVisible: store.switchPlaylistModalVisibility,
  }));
  const [value, setValue] = React.useState("")
  const createPlaylist = () => {
    AsyncStorage.getItem('playlists', (err, result) => {
      if (err) return;
      const newPlaylist = {name: value, items:[]};
      let newPlaylists = [newPlaylist];
      result && (newPlaylists = [...JSON.parse(result), ...newPlaylist])
      AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists))
      setVisible()
    });
  };
  return (
    <Dialog.Container visible={visible} onBackdropPress={setVisible}>
      <Dialog.Title>Create New Playlist</Dialog.Title>
      <Dialog.Input
        onTextInput={(e)=>setValue(e.nativeEvent.text)}
        underlineColorAndroid={scheme.colorPrimary}
        placeholder={'Name for a New Playlist'}></Dialog.Input>
      <Dialog.Button label={'CANCEL'} onPress={setVisible} color={'white'} />
      <Dialog.Button
        label={'CREATE'}
        bold
        color={scheme.colorPrimary}
        onPress={createPlaylist}
      />
    </Dialog.Container>
  );
}
