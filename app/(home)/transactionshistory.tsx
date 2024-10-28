import DetailsHeader from '@/components/DetailsHeader'
import { Colors } from '@/constants/Colors'
import React from 'react'
import { View, Text } from 'react-native'

const transactionshistory = () => {
    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <DetailsHeader title='Transaction History' />
        </View>
    )
}

export default transactionshistory