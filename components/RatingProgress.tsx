import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const RatingProgress = ({ label, value }: { label: string, value: number }) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: verticalScale(10) }}>
            <View >
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={{ marginHorizontal: horizontalScale(15), }}>
                <View style={{ width: horizontalScale(100), height: horizontalScale(7), borderRadius: horizontalScale(20), backgroundColor: Colors.white1 }} />
                <View style={{ width: `${value}%`, height: horizontalScale(7), borderRadius: horizontalScale(20), backgroundColor: Colors.orange, position: 'absolute' }} />
            </View>
            <View style={{ width: '15%' }}>
                <Text style={styles.label}>{value}%</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: moderateScale(12),
        color: Colors.grey,
        fontFamily: Fonts.PoppinsRegular
    }
})

export default RatingProgress