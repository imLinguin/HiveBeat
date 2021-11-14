import React from 'react';
import Home from './Home';
import Artist from './Artist';
import Album from './Album';
import Playlist from './Playlist';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

const Stack = createSharedElementStackNavigator();
export default function HomeTab({navigation}) {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        cardStyleInterpolator: ({current: {progress}}) => {
          return {
            cardStyle: {
              opacity: progress,
            },
          };
        },
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="Album" component={Album} />
      <Stack.Screen name="Playlist" component={Playlist} />
    </Stack.Navigator>
  );
}
