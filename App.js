import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import Main from './screens/Main';
import {videoContext} from './context';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
const App = () => {
  const [videoQueue, setVideoQueue] = useState([]);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [paused, setPaused] = useState(true);
  const [shuffle, setShuffle] = useState(true);
  const [nowPlaying, setNowPlaying] = useState({});
  return (
    <videoContext.Provider
      value={{
        nowPlayingIndex,
        setNowPlayingIndex,
        videoQueue,
        setVideoQueue,
        paused,
        setPaused,
        nowPlaying,
        setNowPlaying,
        shuffle,
        setShuffle,
      }}>
      <NavigationContainer onReady={()=>{RNBootSplash.hide({fade:true})}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar translucent backgroundColor="#0000" />
          <Main />
        </GestureHandlerRootView>
      </NavigationContainer>
    </videoContext.Provider>
  );
};

export default App;
