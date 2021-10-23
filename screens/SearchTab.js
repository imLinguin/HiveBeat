import React from 'react';
import Search from './Search';
import Artist from './Artist';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function SearchTab() {
  return (
    <Stack.Navigator
      initialRouteName={'SearchHome'}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="SearchHome" component={Search} />
      <Stack.Screen name="Artist" component={Artist} />
    </Stack.Navigator>
  );
}
