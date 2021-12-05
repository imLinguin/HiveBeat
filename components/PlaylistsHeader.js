import React from 'react';
import {View, StyleSheet, StatusBar, Pressable} from 'react-native';
import scheme from '../assets/scheme';
import CustomText from './CustomText';

export default function PlaylistsHeader({navigation, context}) {
  return (
    <View style={styles.wrapper} blurRadius={25}>
      <View style={{flexDirection: 'row'}}>
        <Pressable onPress={()=>{
            context.switchPlaylistModalVisibility();
        }}>
          <CustomText style={styles.text}>+</CustomText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: StatusBar.currentHeight + 10,
    zIndex: 2,
    width: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  text: {
    color: scheme.colorPrimary,
    fontSize: 40,
  },
});
