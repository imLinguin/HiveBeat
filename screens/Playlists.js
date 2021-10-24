import React from 'react'
import { View} from 'react-native'
import CustomText from '../components/CustomText'

import Header from '../components/Header'

export default function Playlists({navigation}) {
    return (
        <View>
            <Header navigation={navigation}/>
            <CustomText>Playlists</CustomText>
        </View>
    )
}
