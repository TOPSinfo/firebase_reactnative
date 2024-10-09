import React, { useState } from 'react'
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

const time = ['08 AM', '09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM']

const Calendar = () => {
    const [date, setDate] = useState(dayjs());
    const router = useRouter()

    const onCalendarPress = () => {
        router.back()
    }

    const renderRight = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onCalendarPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ width: horizontalScale(25), alignItems: 'center' }}>
                    <SvgImage url={Images.calendar} style={{ height: verticalScale(18), width: verticalScale(18), tintColor: Colors.orange }} />
                </TouchableOpacity>
                <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ width: horizontalScale(25), alignItems: 'center', marginLeft: horizontalScale(10) }}>
                    <SvgImage url={Images.plus} style={{ height: verticalScale(18), width: verticalScale(18), tintColor: Colors.black1 }} />
                </TouchableOpacity>
            </View>
        )
    }

    const renderTime = ({ item }: { item: string }) => {
        return (
            <View style={{ height: verticalScale(80), justifyContent: 'center', paddingHorizontal: horizontalScale(25), borderBottomWidth: 1, borderBottomColor: Colors.white4 }}>
                <Text style={{ fontFamily: Fonts.PoppinsRegular, fontSize: moderateScale(12), color: Colors.grey }}>{item}</Text>
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
                data={time}
                ListHeaderComponent={renderDate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderTime}
                showsVerticalScrollIndicator={false}
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