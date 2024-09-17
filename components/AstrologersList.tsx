import React from 'react'
import { FlatList } from 'react-native'
import AstrologerCard from './AstrologerCard'
import { horizontalScale } from '@/utils/matrix'
import { astrologersSelector } from '@/redux/selector'


const AstrologersList = ({ scrollable = false }) => {

    const data = astrologersSelector()

    const renderItem = ({ item, index }: { item: any, index: number }) => {
        return <AstrologerCard id={item.id} index={index} name={item.name} ratings={item.ratings} skills={item.skills} />
    }

    return (
        <FlatList
            scrollEnabled={scrollable}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: scrollable ? horizontalScale(100) : 0 }}
            data={scrollable ? [...data, ...data] : data}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

export default AstrologersList