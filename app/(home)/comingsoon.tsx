import AuthHeader from '@/components/AuthHeader'
import LaunchingSoon from '@/components/LaunchingSoon'
import { Colors } from '@/constants/Colors'
import { horizontalScale } from '@/utils/matrix'
import React from 'react'
import { View } from 'react-native'

const ComingSoon = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white, padding: horizontalScale(20) }}>
            <AuthHeader />
            <LaunchingSoon />
        </View>
    )
}

export default ComingSoon