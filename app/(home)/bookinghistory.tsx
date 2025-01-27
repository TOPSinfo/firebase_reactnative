import React from 'react'
import { View, StyleSheet } from 'react-native'
import DetailsHeader from '@/components/DetailsHeader'
import MyBookingList from '@/components/MyBookingList'
import { Colors } from '@/constants/Colors'

const BookingHistory = () => {
    return (
        <View style={style.container}>
            <DetailsHeader title='Booking History' />
            <MyBookingList />
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    }
})

export default BookingHistory