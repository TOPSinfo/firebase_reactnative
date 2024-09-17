import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import moment from 'moment';
import { userSelector } from '@/redux/selector';

const DashboardHeader = () => {

    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();

    const statusBarHeight = insets.top;
    const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight)

    const userData = userSelector()

    return (
        <View style={{ marginTop: statusBarHeight }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.label}>Namaste {userData?.fullName}! </Text>
                        <SvgImage url={Images.hand} style={{ height: horizontalScale(12), width: horizontalScale(12) }} />
                    </View>
                    <Text style={styles.welcome}>Welcome!!</Text>
                    <Text style={[styles.label, { marginTop: verticalScale(5) }]}>{moment().format('DD MMMM YYYY')}</Text>
                </View>
                <View>
                    <SvgImage url={Images.notification} style={{ height: verticalScale(30), width: verticalScale(30) }} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    label: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1
    },
    welcome: {
        fontSize: moderateScale(32),
        fontFamily: Fonts.PoppinsBold,
        color: Colors.black1
    }
})

export default DashboardHeader