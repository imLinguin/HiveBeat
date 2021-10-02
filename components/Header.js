import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import scheme from '../assets/scheme'

export default function Header({navigation}) {
    return(<></>)
    return (
        <View style={styles.wrapper}>
            <View style={{flexDirection:'row'}}>
                <Text style={{...styles.title, color:scheme.colorPrimary}}>Hive</Text>
                <Text style={{...styles.title, color:scheme.textColor}}>Beat</Text>
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