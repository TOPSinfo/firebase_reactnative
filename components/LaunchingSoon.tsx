import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SvgImage from './SvgImage'
import { Images } from '@/constants/Images'
import { moderateScale, verticalScale } from '@/utils/matrix'
import { Fonts } from '@/constants/Fonts'
import { Colors } from '@/constants/Colors'

const LaunchingSoon = () => {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <SvgImage url={Images.launching_soon} style={{ width: '100%', height: verticalScale(305), marginTop: verticalScale(110) }} />
                <View style={{ marginTop: verticalScale(35), alignItems: 'center' }}>
                    <Text style={styles.title}>Launching soon</Text>
                    <Text style={styles.description}>Our engineers are polishing the app to make sure you will have a delightful experience...Hang in there!</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontFamily: Fonts.PoppinsBold,
        fontSize: moderateScale(18),
        color: Colors.black1
    },
    description: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: moderateScale(12),
        color: Colors.grey,
        marginTop: verticalScale(5),
        textAlign: 'center'
    }
})

export default LaunchingSoon