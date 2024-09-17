import React from 'react'
import { Tabs } from 'expo-router';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: Colors.orange, headerShown: false }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <SvgImage url={Images.home} style={{ height: verticalScale(20), width: verticalScale(20), tintColor: color }} />,
                }}
            />
            <Tabs.Screen
                name="myBookings"
                options={{
                    title: 'My Bookings',
                    tabBarIcon: ({ color }) => <SvgImage url={Images.calendar} style={{ height: verticalScale(20), width: verticalScale(20), tintColor: color }} />,
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color }) => <SvgImage url={Images.wallet} style={{ height: verticalScale(20), width: verticalScale(20), tintColor: color }} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <SvgImage url={Images.user} style={{ height: verticalScale(20), width: verticalScale(20), tintColor: color }} />,
                }}
            />
        </Tabs>
    );
}
export default TabLayout