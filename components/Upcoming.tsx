import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SvgImage from './SvgImage'
import { horizontalScale } from '@/utils/matrix'

type UpcomingProps = {
    logo: string,
    title: string,
    color: string
}

const Upcoming = ({ logo, title, color }: UpcomingProps) => {
    return (
        <View style={[styles.container, { borderColor: color }]}>
            <SvgImage url={logo} style={{ height: horizontalScale(32), width: horizontalScale(32) }} />
            <Text style={[styles.title, { color }]}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: horizontalScale(90),
        width: '31%',
        borderWidth: 0.5,
        borderRadius: horizontalScale(7),
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: horizontalScale(8),
        fontFamily: 'Poppins-Bold',
        marginTop: horizontalScale(12)
    }
})

export default Upcoming