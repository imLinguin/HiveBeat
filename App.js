import React, {useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Main from './screens/Main';
import {videoContext} from './context';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  const Stack = createNativeStackNavigator();
  const [videoQueue, setVideoQueue] = useState([]);
  const [paused, setPaused] = useState(true);
  const [nowPlaying, setNowPlaying] = useState({});
  return (
    <videoContext.Provider
      value={{
        videoQueue,
        setVideoQueue,
        paused,
        setPaused,
        nowPlaying,
        setNowPlaying,
      }}>
      <GestureHandlerRootView style={{flex: 1}}>
        <StatusBar translucent backgroundColor="#0000" />
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </GestureHandlerRootView>
    </videoContext.Provider>
  );
};

export default App;
