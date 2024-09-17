import { Colors } from '@/constants/Colors'
import { getRandomColor } from '@/utils/helper'
import { horizontalScale, moderateScale } from '@/utils/matrix'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import SvgImage from './SvgImage'
import { Images } from '@/constants/Images'
import { Fonts } from '@/constants/Fonts'

const ReviewCard = ({ item }: { item: any }) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.colorContainer, { backgroundColor: getRandomColor() }]}>
                            <Text style={styles.firstLetter}>{item.name.slice(0, -item.name.length + 1)}</Text>
                        </View>
                        <Text style={styles.name}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: horizontalScale(5) }}>
                        {[...Array(Number(item.ratings)).keys()].map((key, index) => {
                            return <SvgImage key={key + index} url={Images.star} style={styles.star} />
                        }
                        )}
                    </View>
                </View>
            </View>
            <Text style={[styles.skills, { marginTop: horizontalScale(15), marginLeft: 0 }]}>{item.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: horizontalScale(15),
        borderWidth: 0.5,
        borderColor: Colors.white1,
        borderRadius: horizontalScale(10),
        padding: horizontalScale(15)
    },
    name: {
        fontSize: moderateScale(18),
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.black1
    },
    skills: {
        fontSize: moderateScale(10),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1
    },
    colorContainer: {
        height: horizontalScale(25),
        width: horizontalScale(25),
        borderRadius: horizontalScale(25),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: horizontalScale(5)
    },
    firstLetter: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: moderateScale(12),
        color: Colors.white
    },
    star: {
        height: horizontalScale(13),
        width: horizontalScale(13),
        marginRight: horizontalScale(5)
    }
})

export default ReviewCard