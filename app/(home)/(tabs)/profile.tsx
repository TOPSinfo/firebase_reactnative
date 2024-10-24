import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, ScrollView } from 'react-native'
import React from 'react'
import { auth } from '@/services/config'
import { router } from 'expo-router'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import { Colors } from '@/constants/Colors'
import SvgImage from '@/components/SvgImage'
import { Images } from '@/constants/Images'
import { Fonts } from '@/constants/Fonts'
import ProfileCard from '@/components/ProfileCard'
import * as Application from 'expo-application';


const Option = ({ title, icon, onPress, style }: { title: string, icon: string, onPress: () => void, style?: ViewStyle }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.option, style]}>
            <SvgImage url={icon} style={{ height: verticalScale(16), width: verticalScale(16) }} />
            <Text style={styles.optionLabel}>{title}</Text>
        </TouchableOpacity>
    )
}

const Profile = () => {

    const onLogout = () => {
        auth.signOut()
        router.replace('/(auth)/')
    }

    const onBookingHistory = () => {
        router.navigate('/(home)/bookinghistory')
    }

    const onTransactionHistory = () => {

    }

    const onHelp = () => {

    }

    const onRate = () => {

    }

    const onShare = () => {

    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileCard />
                <View style={{ padding: horizontalScale(25) }}>
                    <View style={styles.optionContainer}>
                        <Option icon={Images.booking_history} title={'Booking History'} onPress={onBookingHistory} style={{ marginBottom: verticalScale(3) }} />
                        <Option icon={Images.transaction_history} title={'Transaction History'} onPress={onTransactionHistory} style={{ marginBottom: verticalScale(3) }} />
                        <Option icon={Images.help} title={'Help / FAQ'} onPress={onHelp} style={{ marginBottom: verticalScale(3) }} />
                        <Option icon={Images.rate} title={'Rate app'} onPress={onRate} />
                    </View>

                    <View style={[styles.optionContainer, { marginTop: horizontalScale(25) }]}>
                        <Option icon={Images.share} title={'Share app'} onPress={onShare} style={{ marginBottom: verticalScale(3) }} />
                        <Option icon={Images.logout} title={'Logout'} onPress={onLogout} />
                    </View>
                </View>
                <View style={{ alignItems: 'center', marginVertical: horizontalScale(10) }}>
                    <Text style={styles.appVersion}>App Version: {Application.nativeApplicationVersion}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white5
    },
    optionContainer: {
        borderRadius: horizontalScale(7),
        overflow: 'hidden',
        backgroundColor: Colors.white3
    },
    option: {
        padding: horizontalScale(15),
        height: verticalScale(60),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1,
        marginLeft: horizontalScale(20)
    },
    appVersion: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1,
    }
})

export default Profile