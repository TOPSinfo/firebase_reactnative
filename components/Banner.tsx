import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import SvgImage from './SvgImage'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import { Images } from '@/constants/Images'
import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'

const Banner = () => {
    return (
        <View>
            <SvgImage url={Images.banner} style={styles.banner} />
            <View style={styles.container}>
                <Text style={styles.appointment}>Appointment</Text>
                <Text style={styles.label}>Connect with astrologer by booking an appointment.</Text>
                <View style={{ alignItems: 'flex-start' }}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={[styles.appointment, { color: Colors.orange, fontSize: moderateScale(9) }]}>Book Appointment</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    banner: {
        height: horizontalScale(185),
        width: horizontalScale(335),
        marginTop: verticalScale(25)
    },
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "flex-end",
        padding: horizontalScale(20)
    },
    appointment: {
        fontSize: moderateScale(12),
        color: Colors.white,
        fontFamily: Fonts.PoppinsRegular
    },
    label: {
        fontSize: moderateScale(12),
        color: Colors.white,
        fontFamily: Fonts.PoppinsBold,
        width: '70%',
        marginVertical: verticalScale(8)
    },
    button: {
        backgroundColor: Colors.white,
        borderRadius: horizontalScale(8),
        padding: horizontalScale(10)
    }
})

export default Banner