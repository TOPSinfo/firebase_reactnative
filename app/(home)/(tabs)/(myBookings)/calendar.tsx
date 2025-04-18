import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import TabHeader from '../../../../components/TabHeader';
import SvgImage from '../../../../components/SvgImage';
import { Images } from '@/constants/Images';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { useRouter } from 'expo-router';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Fonts } from '@/constants/Fonts';
import { myBookingsSelector, userTypeSelector } from '@/redux/selector';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { setSelectedEvent } from '@/redux/eventSlice';
import { userAppColor } from '@/hooks/useAppColor';

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
    { label: '08 PM', timing: '08:00 PM', booking: [] },
  ]);
  const flatlistRef = useRef<FlatList<any>>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const color = userAppColor();
  const userType = userTypeSelector();
  const bookings = myBookingsSelector();

  useEffect(() => {
    const myBookings = bookings.filter(
      (item: any) => item.date === date.format('DD MMM YYYY')
    );
    const bookingTime = [
      ...time.map((item: any) => ({ ...item, booking: [] })),
    ];
    myBookings.forEach((item: any) => {
      const index = bookingTime.findIndex((time: any) => {
        const diff = moment.duration(
          moment(item.starttime, 'hh:mm A').diff(moment(time.timing, 'hh:mm A'))
        );
        return diff.asHours() >= 0 && diff.asHours() < 1;
      });
      if (index !== -1) {
        bookingTime[index].booking.push(item);
        flatlistRef?.current?.scrollToIndex({ index, animated: true });
      }
    });
    setTime(bookingTime);
  }, [date, bookings]);

  /**
   * Handles the press event on the calendar.
   * Navigates back to the previous route using the router.
   */
  const onCalendarPress = () => {
    router.back();
  };

  /**
   * Handles the press event for adding a new booking.
   * Navigates to the astrologer screen using the router.
   */
  const onAddPress = () => {
    router.navigate('/(home)/astrologer');
  };

  /**
   * Returns the color corresponding to the given status.
   *
   * @param {string} status - The status of the booking.
   * @returns {string} - The color associated with the given status.
   *
   * Possible status values and their corresponding colors:
   * - 'approved': Colors.blue
   * - 'waiting': Colors.yellow
   * - 'rejected': Colors.orange
   * - 'deleted': Colors.red1
   * - default: Colors.green
   */
  const getColor = (status: string) => {
    switch (status) {
      case 'approved':
        return Colors.blue;
      case 'waiting':
        return Colors.yellow;
      case 'rejected':
        return Colors.orange;
      case 'deleted':
        return Colors.red1;
      default:
        return Colors.green;
    }
  };

  /**
   * Returns the appropriate icon based on the given status.
   *
   * @param {string} status - The status of the booking.
   * @returns {ImageSource} - The corresponding icon for the given status.
   *
   * Possible status values:
   * - 'approved': Returns the check icon.
   * - 'waiting': Returns the clock icon.
   * - 'rejected': Returns the close icon.
   * - 'deleted': Returns the delete icon.
   * - Any other value: Returns the double check icon.
   */
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
  };

  const renderRight = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={onCalendarPress}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          style={{ width: horizontalScale(25), alignItems: 'center' }}>
          <SvgImage
            url={Images.calendar}
            style={{
              height: verticalScale(18),
              width: verticalScale(18),
              tintColor: color,
            }}
          />
        </TouchableOpacity>
        {userType == 'user' ? (
          <TouchableOpacity
            onPress={onAddPress}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            style={{
              width: horizontalScale(25),
              alignItems: 'center',
              marginLeft: horizontalScale(10),
            }}>
            <SvgImage
              url={Images.plus}
              style={{
                height: verticalScale(18),
                width: verticalScale(18),
                tintColor: Colors.black1,
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  /**
   * Handles the press event for a booking.
   * Dispatches the selected event to the Redux store and navigates to the event screen.
   *
   * @param {Object} booking - The booking object that was pressed.
   */
  const onEventPress = (booking: any) => {
    dispatch(setSelectedEvent(booking));
    router.navigate('/(home)/eventscreen');
  };

  const renderTime = ({ item }: any) => {
    return (
      <View
        style={{
          height: verticalScale(80),
          paddingHorizontal: horizontalScale(25),
          borderBottomWidth: 1,
          borderBottomColor: Colors.white4,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.PoppinsRegular,
            fontSize: moderateScale(12),
            color: Colors.grey,
          }}>
          {item.label}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.booking.map((booking: any, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => onEventPress(booking)}
                key={index}
                style={{
                  marginLeft: horizontalScale(15),
                  height: verticalScale(48),
                  backgroundColor: Colors.white,
                  width: horizontalScale(255),
                  borderRadius: horizontalScale(5),
                  flexDirection: 'row',
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    backgroundColor: getColor(booking.status),
                    width: horizontalScale(38),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <SvgImage
                    url={getIcon(booking.status)}
                    style={{
                      height: verticalScale(16),
                      width: verticalScale(16),
                    }}
                  />
                </View>
                <View
                  style={{
                    paddingLeft: horizontalScale(10),
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: Fonts.PoppinsBold,
                      fontSize: moderateScale(9),
                      color: Colors.black1,
                    }}>
                    Your appointment with{' '}
                    {userType == 'user'
                      ? booking.astrologername
                      : booking.fullname}
                  </Text>
                  <Text
                    style={{
                      fontFamily: Fonts.PoppinsRegular,
                      fontSize: moderateScale(12),
                      color: Colors.grey,
                      marginTop: horizontalScale(2),
                    }}>
                    {booking.starttime} - {booking.endtime}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderDate = () => {
    return (
      <View
        style={{
          height: verticalScale(80),
          justifyContent: 'center',
          paddingHorizontal: horizontalScale(25),
          borderBottomWidth: 1,
          borderBottomColor: Colors.white4,
        }}>
        <Text
          style={{
            fontFamily: Fonts.PoppinsBold,
            fontSize: moderateScale(16),
          }}>
          {date.format('DD MMMM')} Events
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TabHeader title="Calendar" right={renderRight()} />
      <View style={styles.calendarContainer}>
        <DateTimePicker
          mode="single"
          date={date}
          displayFullDays={true}
          onChange={params => params.date && setDate(dayjs(params.date))}
          firstDayOfWeek={1}
          headerTextStyle={{
            fontFamily: Fonts.PoppinsBold,
            fontSize: moderateScale(16),
          }}
          weekDaysTextStyle={{
            fontFamily: Fonts.PoppinsBold,
            fontSize: moderateScale(12),
          }}
          calendarTextStyle={{
            fontFamily: Fonts.PoppinsRegular,
            fontSize: moderateScale(12),
          }}
          selectedItemColor={color}
          selectedTextStyle={{ color: Colors.white }}
          todayTextStyle={{ color: color }}
          todayContainerStyle={{
            backgroundColor:
              userType == 'user' ? Colors.orange1 : Colors.lightBlue,
            borderWidth: 0,
            borderRadius: 7,
          }}
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
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          // Layout doesn't know the exact location of the requested element.
          // Falling back to calculating the destination manually
          console.log('Failed to scroll to index ', index, averageItemLength);
          setTimeout(() => {
            flatlistRef.current?.scrollToOffset({
              offset: index * verticalScale(90),
              animated: true,
            });
          }, 500);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    paddingHorizontal: horizontalScale(15),
    paddingBottom: verticalScale(10),
    backgroundColor: Colors.white,
    borderBottomLeftRadius: horizontalScale(25),
    borderBottomRightRadius: horizontalScale(25),
  },
});

export default Calendar;
