import React from 'react'
import { Tabs } from 'expo-router';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, isIphoneX, moderateScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const TabBarButton = ({ title, icon, onPress, focused }: any) => {
    const color = focused ? Colors.orange : Colors.grey
    const indicatorColor = focused ? Colors.orange : 'transparent'

    return <TouchableOpacity onPress={onPress} style={[styles.tab, { transform: [{ translateY: focused ? verticalScale(isIphoneX ? -22 : -18) : 1 }] }]}>
        <View style={styles.iconContainer}>
            <SvgImage url={icon} style={{ height: verticalScale(20), width: verticalScale(20), tintColor: color }} />
        </View>
        <Text style={[styles.tabTitle, { color: color }]}>{title}</Text>
        <View style={{ position: 'absolute', top: horizontalScale(-2.5), height: 3.5, backgroundColor: indicatorColor, width: 3.5, borderRadius: 3.5 }} />
    </TouchableOpacity>
}

const TabLayout = () => {
    const inset = useSafeAreaInsets()

    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: Colors.orange, headerShown: false, tabBarStyle: { ...styles.tabContainer, height: verticalScale(65) + inset.bottom } }}>
            <Tabs.Screen
                name="home"
                options={{
                    tabBarButton: ({ accessibilityState, onPress }) => <TabBarButton title={'Home'} focused={accessibilityState?.selected} icon={Images.home} onPress={onPress} />
                }}
            />
            <Tabs.Screen
                name="(myBookings)"
                options={{
                    tabBarButton: ({ accessibilityState, onPress }) => <TabBarButton title={'My Bookings'} focused={accessibilityState?.selected} icon={Images.calendar} onPress={onPress} />
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    tabBarButton: ({ accessibilityState, onPress }) => <TabBarButton title={'Wallet'} focused={accessibilityState?.selected} icon={Images.wallet} onPress={onPress} />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarButton: ({ accessibilityState, onPress }) => <TabBarButton title={'Profile'} focused={accessibilityState?.selected} icon={Images.user} onPress={onPress} />
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        borderTopWidth: 0,
        borderTopLeftRadius: horizontalScale(10),
        borderTopRightRadius: horizontalScale(10),
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        height: verticalScale(40),
        width: verticalScale(40),
        borderRadius: verticalScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    tabTitle: {
        fontFamily: Fonts.PoppinsRegular,
        fontSize: moderateScale(12),
    }
})
export default TabLayout