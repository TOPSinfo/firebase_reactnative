import { Colors } from '@/constants/Colors'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import SvgImage from './SvgImage'
import { Images } from '@/constants/Images'
import { userSelector } from '@/redux/selector'
import { Fonts } from '@/constants/Fonts'
import { getSunSign } from '@/utils/helper'

const ProfileCard = () => {

    const user = userSelector()

    const sunSign = getSunSign(user.fullName)

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profile}>
                    <SvgImage url={Images.user} style={{ height: verticalScale(40), width: verticalScale(40) }} />
                    <TouchableOpacity style={styles.edit}>
                        <SvgImage url={Images.edit} style={{ height: verticalScale(8), width: verticalScale(8) }} />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: verticalScale(15) }}>
                    <Text style={styles.name}>{user.fullName}</Text>
                </View>
            </View>
            <View style={styles.optionContainer}>
                <View style={styles.option}>
                    <SvgImage url={Images.date_of_birth} style={{ height: verticalScale(16), width: verticalScale(16), tintColor: Colors.blue }} />
                    <Text style={styles.optionLabel}>Date of Birth</Text>
                    <Text style={styles.value}>{user.dob ?? 'DD MMM YYYY'}</Text>
                </View>
                <View style={styles.option}>
                    <SvgImage url={Images.sun_sign} style={{ height: verticalScale(16), width: verticalScale(16) }} />
                    <Text style={styles.optionLabel}>Sun sign</Text>
                    <Text style={styles.value}>{sunSign}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white3,
        height: verticalScale(320)
    },
    profileContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: horizontalScale(13)
    },
    profile: {
        height: verticalScale(105),
        width: verticalScale(105),
        borderRadius: verticalScale(105),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white6
    },
    edit: {
        height: verticalScale(17),
        width: verticalScale(17),
        borderRadius: verticalScale(17),
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: verticalScale(8),
        right: horizontalScale(8)
    },
    name: {
        fontSize: moderateScale(20),
        fontFamily: Fonts.PoppinsBold,
        color: Colors.black1
    },
    optionContainer: {
        marginTop: verticalScale(3),
        flex: 0.35,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    option: {
        flex: 0.495,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    optionLabel: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.grey,
    },
    value: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1,
        marginTop: verticalScale(2.5)
    }
})

export default ProfileCard