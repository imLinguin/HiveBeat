import React from 'react'
import { View } from 'react-native'
import scheme from '../assets/scheme';
import CustomText from './CustomText';

export default function ArtistCategory({style, children, title}) {
    return (
        <View {...style}>
          <CustomText
            style={{
              color: scheme.textColor,
              marginHorizontal: 10,
              fontSize: 20,
              fontWeight: '900',
            }}>
            {title}
          </CustomText>
          {children}
        </View>
    );
}
