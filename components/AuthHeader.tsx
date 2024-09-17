import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import { horizontalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { useRouter } from 'expo-router';

const AuthHeader = () => {
    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();

    const statusBarHeight = insets.top;
    const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight)

    const router = useRouter()

    const onBack = () => {
        router.back()
    }


    return (
        <View style={[styles.container, { height: defaultHeight }]}>
            <View pointerEvents="none" style={{ height: statusBarHeight }} />
            <TouchableOpacity onPress={onBack} style={{ width: '15%' }}>
                <SvgImage url={Images.back} style={{ height: horizontalScale(40), width: horizontalScale(40) }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default AuthHeader