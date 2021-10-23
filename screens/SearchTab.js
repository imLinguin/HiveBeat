import React from 'react';
import Search from './Search';
import Artist from './Artist';
import Album from './Album';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();
export default function SearchTab() {
  return (
    <Stack.Navigator
      initialRouteName={'SearchHome'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="SearchHome" component={Search} />
      <Stack.Screen name="Artist" component={Artist} />
      <Stack.Screen name="Album" component={Album} />
    </Stack.Navigator>
  );
}
