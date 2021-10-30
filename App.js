import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RNBootSplash from 'react-native-bootsplash';
import Main from './screens/Main';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
const App = () => {
  return (
      <NavigationContainer onReady={()=>{RNBootSplash.hide({fade:true})}}>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar translucent backgroundColor="#0000" />
          <Main />
        </GestureHandlerRootView>
      </NavigationContainer>
  );
};

export default App;
