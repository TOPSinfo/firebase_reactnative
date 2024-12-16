import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { myBookingsSelector } from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { getMyBookings } from '@/services/db';
import BookingCard from './BookingCard';
import moment from 'moment';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import { userAppColor } from '@/hooks/useAppColor';
import { useFocusEffect } from 'expo-router';

const MyBookingList = () => {
  const [tab, setTab] = useState(1);
  const bookings = myBookingsSelector();
  const color = userAppColor();

  const dispatch = useDispatch();
  const fetchBookings = async () => {
    dispatch(setLoading(true));
    const res = await getMyBookings();
    dispatch(setLoading(false));
  };

  // useEffect(() => {
  //   fetchBookings();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onTabPress = (index: number) => {
    setTab(index);
  };

  const renderTab = (label: string, index: number) => {
    return (
      <View style={styles.tab}>
        <TouchableOpacity
          onPress={() => onTabPress(index)}
          style={{
            flex: 1,
            justifyContent: 'center',
            width: '90%',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.tabLabel,
              {
                color: tab == index ? color : Colors.grey,
              },
            ]}>
            {label}
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.tabIndicator,
            {
              backgroundColor: tab === index ? color : Colors.white3,
            },
          ]}
        />
      </View>
    );
  };

  const renderItem = ({ item }: any) => {
    return <BookingCard data={item} />;
  };

  const mybookings = useMemo(() => {
    if (tab === 1) {
      return bookings.filter((booking: any) =>
        moment(booking.date, 'DD MMM YYYY').isAfter()
      );
    } else if (tab === 2) {
      return bookings.filter((booking: any) =>
        moment(booking.date, 'DD MMM YYYY').isSame(moment(), 'day')
      );
    } else {
      return bookings.filter((booking: any) =>
        moment(booking.date, 'DD MMM YYYY').isBefore(moment(), 'day')
      );
    }
  }, [tab, bookings]);

  return (
    <View>
      <View style={styles.tabContainer}>
        {renderTab('Upcoming', 1)}
        {renderTab('Ongoing', 2)}
        {renderTab('Past', 3)}
      </View>
      <View style={{ paddingHorizontal: horizontalScale(20) }}>
        <FlatList
          data={mybookings}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: horizontalScale(160),
            paddingTop: horizontalScale(20),
          }}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: verticalScale(50),
    backgroundColor: Colors.white3,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: verticalScale(2),
    borderRadius: verticalScale(2),
  },
  tabLabel: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
  },
});

export default MyBookingList;
