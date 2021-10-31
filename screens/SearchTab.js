import React from 'react';
import Search from './Search';
import Artist from './Artist';
import Album from './Album';
import Playlist from './Playlist'
import {createSharedElementStackNavigator} from 'react-navigation-shared-element'

const Stack = createSharedElementStackNavigator();
export default function SearchTab() {
  return (
    <Stack.Navigator
      initialRouteName={'SearchHome'}
      screenOptions={{headerShown: false,
      gestureEnabled:false,
      cardStyleInterpolator: ({current:{progress}})=>{
        return {
          cardStyle:{
            opacity: progress
          }
        }
      }
      }}>
      <Stack.Screen name="SearchHome" component={Search} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="Album" component={Album} />
      <Stack.Screen name="Playlist" component={Playlist} />
    </Stack.Navigator>
  );
}
