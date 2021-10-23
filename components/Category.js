import React from 'react'
import { View, Text } from 'react-native'
import scheme from '../assets/scheme';

export default function Category({style, children, title}) {
    return (
        <View {...style}>
          <Text
            style={{
              color: scheme.textColor,
              marginHorizontal: 10,
              fontSize: 20,
              fontWeight: '900',
            }}>
            {title}
          </Text>
          {children}
        </View>
    );
}
