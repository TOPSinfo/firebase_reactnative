import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import TabHeader from '@/components/TabHeader'
import SvgImage from '@/components/SvgImage'
import { Images } from '@/constants/Images'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import BookingCard from '@/components/BookingCard'
import { useDispatch } from 'react-redux'
import { setLoading } from '@/redux/loadingSlice'
import { getMyBookings } from '@/services/db'
import moment from 'moment'
import { useRouter } from 'expo-router'
import { setMyBookings } from '@/redux/userSlice'
import { myBookingsSelector } from '@/redux/selector'

const MyBookings = () => {
    const [tab, setTab] = useState(1)
    const bookings = myBookingsSelector()
    const disatch = useDispatch()
    const router = useRouter()

    const fetchBookings = async () => {
        disatch(setLoading(true))
        const res = await getMyBookings()
        if (res) {
            disatch(setMyBookings(res))
        }
        disatch(setLoading(false))
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const onCalendarPress = () => {
        router.push('/(tabs)/(myBookings)/calendar')
    }

    const onAddPress = () => {
        router.navigate('/(home)/astrologer')
    }

    const renderRight = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onCalendarPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ width: horizontalScale(25), alignItems: 'center' }}>
                    <SvgImage url={Images.calendar} style={{ height: verticalScale(18), width: verticalScale(18), tintColor: Colors.black1 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ width: horizontalScale(25), alignItems: 'center', marginLeft: horizontalScale(10) }}>
                    <SvgImage url={Images.plus} style={{ height: verticalScale(18), width: verticalScale(18), tintColor: Colors.black1 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const onTabPress = (index: number) => {
        setTab(index)
    }

    const renderTab = (label: string, index: number) => {
        return (
            <View style={styles.tab}>
                <TouchableOpacity onPress={() => onTabPress(index)} style={{ flex: 1, justifyContent: 'center', width: '90%', alignItems: 'center' }} >
                    <Text style={[styles.tabLabel, { color: tab == index ? Colors.orange : Colors.grey }]}>{label}</Text>
                </TouchableOpacity>
                <View style={[styles.tabIndicator, { backgroundColor: tab === index ? Colors.orange : Colors.white3 }]} />
            </View>
        )
    }

    const renderItem = ({ item }: any) => {
        return <BookingCard data={item} />
    }

    const mybookings = useMemo(() => {
        if (tab === 1) {
            return bookings.filter((booking: any) => moment(booking.date, 'DD MMM YYYY').isAfter())
        } else if (tab === 2) {
            return bookings.filter((booking: any) => moment(booking.date, 'DD MMM YYYY').isSame(moment(), 'day'))
        } else {
            return bookings.filter((booking: any) => moment(booking.date, 'DD MMM YYYY').isBefore(moment(), 'day'))
        }
    }, [tab, bookings])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.white }}>
            <TabHeader title='My Bookings' right={renderRight()} />
            <View style={styles.tabContainer}>
                {renderTab('Upcoming', 1)}
                {renderTab('Ongoing', 2)}
                {renderTab('Past', 3)}
            </View>
            <View style={{ paddingHorizontal: horizontalScale(20) }}>
                <FlatList
                    data={mybookings}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: horizontalScale(160), paddingTop: horizontalScale(20) }}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: verticalScale(50),
        backgroundColor: Colors.white3
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: verticalScale(2),
        borderRadius: verticalScale(2)
    },
    tabLabel: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.grey
    }
})

export default MyBookings