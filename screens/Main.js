import React from 'react';
import {TouchableOpacity, useWindowDimensions} from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabBar,
} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import SvgIcon from 'react-native-svg-icon';
import icons from '../assets/icons';

import Home from './Home';
import Playlists from './Playlists';
import Player from '../components/Player';
import scheme from '../assets/scheme';
import SearchTab from './SearchTab';

const Icon = props => <SvgIcon {...props} svgs={icons} />;

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
          tabBarButton: props => <TouchableOpacity {...props} />,
        })}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                height={focused ? '30' : '25'}
                viewBox="0 0 50 64"
                name="Home"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchTab}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                height={focused ? '30' : '25'}
                viewBox="0 0 54 65"
                name="Search"
              />
            ),
          }}
        />
        <Tab.Screen
          name="Playlists"
          component={Playlists}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon
                height={focused ? '25' : '20'}
                viewBox="0 0 47 38"
                name="Playlists"
              />
            ),
          }}
        />
      </Tab.Navigator>
      <Player />
    </>
  );
}
