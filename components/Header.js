import React from 'react'
import { View, StyleSheet } from 'react-native'

import scheme from '../assets/scheme'
import CustomText from './CustomText'

export default function Header({navigation}) {
    return(<></>)
    return (
        <View style={styles.wrapper}>
            <View style={{flexDirection:'row'}}>
                <CustomText style={{...styles.title, color:scheme.colorPrimary}}>Hive</CustomText>
                <CustomText style={{...styles.title, color:scheme.textColor}}>Beat</CustomText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: scheme.headerBg,
    },
    title: {
        fontSize: 25,
        fontWeight:"bold"
    }
})