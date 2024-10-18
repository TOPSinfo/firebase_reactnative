import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native'
import TabHeader from '../../../../components/TabHeader'
import SvgImage from '../../../../components/SvgImage'
import { Images } from '@/constants/Images'
import { Colors } from '@/constants/Colors'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import { useRouter } from 'expo-router'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Fonts } from '@/constants/Fonts'
import { myBookingsSelector } from '@/redux/selector'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { setSelectedEvent } from '@/redux/eventSlice'

const Calendar = () => {
    const [date, setDate] = useState(dayjs());
    const [time, setTime] = useState([
        { label: '08 AM', timing: '08:00 AM', booking: [] },
        { label: '09 AM', timing: '09:00 AM', booking: [] },
        { label: '10 AM', timing: '10:00 AM', booking: [] },
        { label: '11 AM', timing: '11:00 AM', booking: [] },
        { label: '12 PM', timing: '12:00 PM', booking: [] },
        { label: '01 PM', timing: '01:00 PM', booking: [] },
        { label: '02 PM', timing: '02:00 PM', booking: [] },
        { label: '03 PM', timing: '03:00 PM', booking: [] },
        { label: '04 PM', timing: '04:00 PM', booking: [] },
        { label: '05 PM', timing: '05:00 PM', booking: [] },
        { label: '06 PM', timing: '06:00 PM', booking: [] },
        { label: '07 PM', timing: '07:00 PM', booking: [] },
        { label: '08 PM', timing: '08:00 PM', booking: [] }
    ])
    const flatlistRef = useRef<FlatList<any>>(null)
    const router = useRouter()
    const dispatch = useDispatch()

    const bookings = myBookingsSelector()

    useEffect(() => {
        const myBookings = bookings.filter((item: any) => item.date === date.format('DD MMM YYYY'))
        const bookingTime = [...time.map((item: any) => ({ ...item, booking: [] }))]
        myBookings.forEach((item: any) => {
            const index = bookingTime.findIndex((time: any) => {
                const diff = moment.duration(moment(item.startTime, 'hh:mm A').diff(moment(time.timing, 'hh:mm A')));
                return diff.asHours() >= 0 && diff.asHours() < 1
            })
            if (index !== -1) {
                bookingTime[index].booking.push(item)
                flatlistRef?.current?.scrollToIndex({ index, animated: true })
            }
        })
        setTime(bookingTime)
    }, [date])

    const onCalendarPress = () => {
        router.back()
    }

    const onAddPress = () => {
        router.navigate('/(home)/astrologer')
    }

    const getColor = (status: string) => {
        switch (status) {
            case 'approved':
                return Colors.blue;
            case 'waiting':
                return Colors.yellow;
            case 'rejected':
                return Colors.orange;
            case 'deleted':
                return Colors.red;
            default:
                return Colors.green;
        }
    }

    const getIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return Images.check;
            case 'waiting':
                return Images.clock;
            case 'rejected':
                return Images.close;
            case 'deleted':
                return Images.delete;
            default:
                return Images.double_check;
        }
    }

    const renderRight = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onCalendarPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ width: horizontalScale(25), alignItems: 'center' }}>
                    <SvgImage url={Images.calendar} style={{ height: verticalScale(18), width: verticalScale(18), tintColor: Colors.orange }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onAddPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ width: horizontalScale(25), alignItems: 'center', marginLeft: horizontalScale(10) }}>
                    <SvgImage url={Images.plus} style={{ height: verticalScale(18), width: verticalScale(18), tintColor: Colors.black1 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const onEventPress = (booking: any) => {
        dispatch(setSelectedEvent(booking))
        router.navigate('/(home)/eventscreen')
    }

    const renderTime = ({ item }: any) => {
        return (
            <View style={{ height: verticalScale(80), paddingHorizontal: horizontalScale(25), borderBottomWidth: 1, borderBottomColor: Colors.white4, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontFamily: Fonts.PoppinsRegular, fontSize: moderateScale(12), color: Colors.grey }}>{item.label}</Text>
                {item.booking.map((booking: any, index: number) => {
                    return <TouchableOpacity onPress={() => onEventPress(booking)} key={index} style={{ marginLeft: horizontalScale(15), height: verticalScale(48), backgroundColor: Colors.white, width: horizontalScale(255), borderRadius: horizontalScale(5), flexDirection: 'row', overflow: 'hidden' }}>
                        <View style={{ backgroundColor: getColor(booking.status), width: horizontalScale(38), justifyContent: 'center', alignItems: 'center' }}>
                            <SvgImage url={getIcon(booking.status)} style={{ height: verticalScale(16), width: verticalScale(16) }} />
                        </View>
                        <View style={{ paddingLeft: horizontalScale(10), justifyContent: 'center' }}>
                            <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: moderateScale(9), color: Colors.black1 }}>Your appointment with {booking.astrologerName}</Text>
                            <Text style={{ fontFamily: Fonts.PoppinsRegular, fontSize: moderateScale(12), color: Colors.grey }}>{booking.startTime} - {booking.endTime}</Text>
                        </View>
                    </TouchableOpacity>
                })}
            </View>
        )
    }

    const renderDate = () => {
        return (
            <View style={{ height: verticalScale(80), justifyContent: 'center', paddingHorizontal: horizontalScale(25), borderBottomWidth: 1, borderBottomColor: Colors.white4 }}>
                <Text style={{ fontFamily: Fonts.PoppinsBold, fontSize: moderateScale(16) }}>{date.format('DD MMMM')} Events</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <TabHeader title='Calendar' right={renderRight()} />
            <View style={{ paddingHorizontal: horizontalScale(15), backgroundColor: Colors.white, borderBottomLeftRadius: horizontalScale(25), borderBottomRightRadius: horizontalScale(25) }}>
                <DateTimePicker
                    mode="single"
                    date={date}
                    displayFullDays={true}
                    onChange={(params) => params.date && setDate(dayjs(params.date))}
                    firstDayOfWeek={1}
                    headerTextStyle={{ fontFamily: Fonts.PoppinsBold, fontSize: moderateScale(16) }}
                    weekDaysTextStyle={{ fontFamily: Fonts.PoppinsBold, fontSize: moderateScale(12) }}
                    calendarTextStyle={{ fontFamily: Fonts.PoppinsRegular, fontSize: moderateScale(12) }}
                    selectedItemColor={Colors.orange}
                    selectedTextStyle={{ color: Colors.white }}
                    todayTextStyle={{ color: Colors.orange }}
                    todayContainerStyle={{ backgroundColor: Colors.orange1, borderWidth: 0, borderRadius: 7 }}
                    dayContainerStyle={{ borderWidth: 0, borderRadius: 7 }}
                />
            </View>
            <FlatList
                ref={flatlistRef}
                data={time}
                ListHeaderComponent={renderDate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderTime}
                showsVerticalScrollIndicator={false}
                onScrollToIndexFailed={({
                    index,
                    averageItemLength,
                }) => {
                    // Layout doesn't know the exact location of the requested element.
                    // Falling back to calculating the destination manually
                    flatlistRef.current?.scrollToOffset({
                        offset: index * averageItemLength,
                        animated: true,
                    });
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default Calendar