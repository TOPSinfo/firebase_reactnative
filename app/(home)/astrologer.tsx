import AstrologersList from '@/components/AstrologersList'
import DetailsHeader from '@/components/DetailsHeader'
import { Colors } from '@/constants/Colors'
import { Images } from '@/constants/Images'
import { horizontalScale } from '@/utils/matrix'
import React from 'react'
import { View, Text } from 'react-native'

const SelectAstrologer = () => {


    const onFilter = () => {

    }

    return (
        <View style={{ flex: 1 }}>
            <DetailsHeader title='Select Astrologer' rightIcon={Images.filter} onRight={onFilter} />
            <View style={{ padding: horizontalScale(20), backgroundColor: Colors.white }}>
                <AstrologersList scrollable={true} />
            </View>
        </View>
    )
}

export default SelectAstrologer