import React from 'react'
import { View, Text } from 'react-native'

import Header from '../components/Header'

export default function Playlists({navigation}) {
    return (
        <View>
            <Header navigation={navigation}/>
            <Text>Playlists</Text>
        </View>
    )
}
