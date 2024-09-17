import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import RatingProgress from './RatingProgress'

const Ratings = ({ rating }: { rating: string }) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: horizontalScale(10) }}>
            <View style={styles.circle}>
                <Text style={styles.rating}>{rating}</Text>
                <Text style={styles.of}>of 5</Text>
            </View>
            <View>
                <RatingProgress label={'5 Star'} value={70} />
                <RatingProgress label={'4 Star'} value={20} />
                <RatingProgress label={'3 Star'} value={0} />
                <RatingProgress label={'2 Star'} value={10} />
                <RatingProgress label={'1 Star'} value={0} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    circle: {
        backgroundColor: Colors.orange,
        height: horizontalScale(120),
        width: horizontalScale(120),
        borderRadius: horizontalScale(120),
        justifyContent: 'center',
        alignItems: 'center'
    },
    rating: {
        fontSize: moderateScale(28),
        color: Colors.white,
        fontFamily: Fonts.PoppinsBold
    },
    of: {
        fontSize: moderateScale(16),
        color: Colors.white,
        fontFamily: Fonts.PoppinsRegular,
        lineHeight: moderateScale(18)
    }
})

export default Ratings