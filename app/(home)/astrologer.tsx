import AstrologersList from '@/components/AstrologersList'
import DetailsHeader from '@/components/DetailsHeader'
import FilterModal from '@/components/FilterModal'
import { Colors } from '@/constants/Colors'
import { Images } from '@/constants/Images'
import { horizontalScale } from '@/utils/matrix'
import React, { useState } from 'react'
import { View, Text } from 'react-native'

const SelectAstrologer = () => {
    const [filterVisible, setFilterVisible] = useState(false)

    const onFilter = () => {
        setFilterVisible(true)
    }

    const onCloseFilter = () => {
        setFilterVisible(false)
    }

    return (
        <View style={{ flex: 1 }}>
            <DetailsHeader title='Select Astrologer' rightIcon={Images.filter} onRight={onFilter} />
            <View style={{ padding: horizontalScale(20), backgroundColor: Colors.white }}>
                <AstrologersList scrollable={true} />
            </View>
            <FilterModal visible={filterVisible} onClose={onCloseFilter} />
        </View>
    )
}

export default SelectAstrologer