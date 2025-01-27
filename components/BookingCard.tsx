import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { setSelectedEvent } from '@/redux/eventSlice';
import { userTypeSelector } from '@/redux/selector';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';

const BookingCard = ({ data }: any) => {
  const dispatch = useDispatch();

  const userType = userTypeSelector();
  const color = useMemo(() => {
    const status = data.status;
    if (status === 'approved') {
      return Colors.blue;
    } else if (status === 'waiting') {
      return Colors.yellow;
    } else if (status === 'rejected') {
      return Colors.orange;
    } else if (status === 'deleted') {
      return Colors.red1;
    } else {
      return Colors.green;
    }
  }, [data.status]);

  /**
   * Handles the event press action.
   * Dispatches the selected event data to the store and navigates to the event screen.
   *
   * @remarks
   * This function is triggered when an event is pressed.
   *
   * @returns {void}
   */
  const onEventPress = () => {
    dispatch(setSelectedEvent(data));
    router.navigate('/(home)/eventscreen');
  };

  return (
    <TouchableOpacity onPress={onEventPress} style={styles.container}>
      <View style={[styles.dateContainer, { backgroundColor: color }]}>
        <Text style={styles.date}>{data.date.slice(0, 2)}</Text>
        <Text style={styles.date}>{data.date.slice(2, 6)}</Text>
      </View>
      <View
        style={{
          padding: horizontalScale(10),
          paddingLeft: horizontalScale(15),
          flex: 1,
        }}>
        {userType === 'user' ? (
          <Text
            numberOfLines={2}
            style={[
              styles.label,
              {
                color: Colors.black1,
                fontSize: moderateScale(12),
                lineHeight: moderateScale(20),
              },
            ]}>
            With Astro {data.astrologername}
          </Text>
        ) : (
          <Text
            numberOfLines={2}
            style={[
              styles.label,
              {
                color: Colors.black1,
                fontSize: moderateScale(12),
                lineHeight: moderateScale(20),
              },
            ]}>
            Your Appointment with {data.fullname}
          </Text>
        )}
        <Text style={styles.label}>
          Time: {data.starttime} - {data.endtime}
        </Text>
        {userType == 'user' ? (
          <Text style={styles.label}>Rate: {data.astrologercharge}/min</Text>
        ) : null}
        <Text style={styles.label}>
          Status:{' '}
          <Text style={{ textTransform: 'capitalize', color }}>
            {data.status}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white3,
    marginBottom: verticalScale(15),
    borderRadius: horizontalScale(6),
    overflow: 'hidden',
  },
  dateContainer: {
    width: horizontalScale(85),
    justifyContent: 'center',
    alignItems: 'center',
  },
  date: {
    fontSize: moderateScale(16),
    color: Colors.white,
    fontFamily: Fonts.PoppinsBold,
    lineHeight: moderateScale(22),
  },
  label: {
    fontSize: moderateScale(10),
    color: Colors.grey,
    fontFamily: Fonts.PoppinsRegular,
    lineHeight: moderateScale(16),
  },
});

export default BookingCard;
