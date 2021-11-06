import React from 'react';
import {Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Home from './Home';
import Playlists from './Playlists';
import Player from '../components/Player';
import scheme from '../assets/scheme';
import SearchTab from './SearchTab';


const Tab = createBottomTabNavigator();
export default function Main() {
  const {width, height} = useWindowDimensions();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={props => (
          <LinearGradient
            style={{
              position: 'absolute',
              bottom: 0,
              width,
              height: 110,
              justifyContent: 'flex-end',
            }}
            colors={[
              'rgba(0, 0, 0, 0)',
              'rgba(0,0,0,0.5)',
              'rgba(0, 0, 0, 1)',
            ]}>
            <BottomTabBar {...props} />
          </LinearGradient>
        )}
        screenOptions={({route}) => ({
          tabBarStyle: {
            elevation: 0,
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            bottom: 0,
            position: 'absolute',
          },
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: scheme.colorPrimary,
          tabBarHideOnKeyboard: true,
          tabBarButton: props => <TouchableOpacity {...props}/>,
        })}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../assets/Home.png')}
                style={{height: focused ? 35 : 30, width: focused ? 30 : 25}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchTab}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../assets/Search.png')}
                style={{height: focused ? 35 : 30, width: focused ? 30 : 25}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Playlists"
          component={Playlists}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={require('../assets/Playlists.png')}
                style={{height: focused ? 30 : 25, width: focused ? 37 : 32}}
              />
            ),
          }}
        />
      </Tab.Navigator>
      <Player />
    </>
  );
}
