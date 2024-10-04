import AstrologersList from '@/components/AstrologersList'
import DetailsHeader from '@/components/DetailsHeader'
import FilterModal from '@/components/FilterModal'
import { Colors } from '@/constants/Colors'
import { Images } from '@/constants/Images'
import { astrologersSelector } from '@/redux/selector'
import { horizontalScale } from '@/utils/matrix'
import React, { useState } from 'react'
import { View, Text } from 'react-native'

const SelectAstrologer = () => {
    const [filterVisible, setFilterVisible] = useState(false)

    const astrologers = astrologersSelector()

    const [astrologersList, setAstrologersList] = useState(astrologers)


    const onFilter = () => {
        setFilterVisible(true)
    }

    const onReset = () => {
        setFilterVisible(false)
        setAstrologersList(astrologers)
    }

    const onApply = ((sort: string, skills: string[], language: string[], gender: string) => {
        const filteredAstrologers = astrologers.filter((astrologer: any) => {
            const genderMatch = gender ? astrologer.gender === gender : true;
            const skillsMatch = skills.length ? skills.some(skill => astrologer.skills.includes(skill)) : true;
            const languageMatch = language.length ? language.some(lng => astrologer.language.includes(lng)) : true;
            return genderMatch && skillsMatch && languageMatch;
        })
        setAstrologersList(filteredAstrologers)
        setFilterVisible(false)
    })

    return (
        <View style={{ flex: 1 }}>
            <DetailsHeader title='Select Astrologer' rightIcon={Images.filter} onRight={onFilter} />
            <View style={{ flex: 1, padding: horizontalScale(20), backgroundColor: Colors.white }}>
                <AstrologersList data={astrologersList} scrollable={true} />
            </View>
            <FilterModal visible={filterVisible} onResetFilter={onReset} onApplyFilter={onApply} />
        </View>
    )
}

export default SelectAstrologer