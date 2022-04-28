import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import scheme from '../assets/scheme';

export default function Loading(props) {
  return (
    <View {...props}>
      <ActivityIndicator color={scheme.colorPrimary} size="large" />
    </View>
  );
}
