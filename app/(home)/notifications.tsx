import React from 'react'
import { View } from 'react-native'
import DetailsHeader from '@/components/DetailsHeader'
import { Colors } from '@/constants/Colors'

const Notifications = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <DetailsHeader title='Notifications' />
        </View>
    )
}

export default Notifications