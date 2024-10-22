import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const BookingCard = ({ data }: any) => {

    const color = useMemo(() => {
        const status = data.status
        if (status === 'approved') {
            return Colors.blue
        } else if (status === 'waiting') {
            return Colors.yellow
        }
        else if (status === 'rejected') {
            return Colors.orange
        }
        else if (status === 'deleted') {
            return Colors.red1
        }
        else {
            return Colors.green
        }
    }, [data.status])


    return (
        <View style={styles.container}>
            <View style={[styles.dateContainer, { backgroundColor: color }]}>
                <Text style={styles.date}>{data.date.slice(0, 2)}</Text>
                <Text style={styles.date}>{data.date.slice(2, 6)}</Text>
            </View>
            <View style={{ padding: horizontalScale(10), paddingLeft: horizontalScale(15) }}>
                <Text style={[styles.label, { color: Colors.black1, fontSize: moderateScale(12), lineHeight: moderateScale(20) }]}>With Astro {data.astrologerName}</Text>
                <Text style={styles.label}>Time: {data.startTime} - {data.endTime}</Text>
                <Text style={styles.label}>Rate: {data.rate}/min</Text>
                <Text style={styles.label}>Status: <Text style={{ textTransform: 'capitalize', color }}>{data.status}</Text></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.white3,
        marginBottom: verticalScale(15),
        borderRadius: horizontalScale(6),
        overflow: 'hidden'
    },
    dateContainer: {
        width: horizontalScale(85),
        justifyContent: 'center',
        alignItems: 'center',
    },
    date: {
        fontSize: moderateScale(16),
        color: Colors.white,
        fontFamily: Fonts.PoppinsBold,
        lineHeight: moderateScale(22)
    },
    label: {
        fontSize: moderateScale(10),
        color: Colors.grey,
        fontFamily: Fonts.PoppinsRegular,
        lineHeight: moderateScale(16),
    }
})

export default BookingCard