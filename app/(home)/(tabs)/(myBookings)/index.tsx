import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TabHeader from '@/components/TabHeader';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import MyBookingList from '@/components/MyBookingList';
import { userTypeSelector } from '@/redux/selector';

const MyBookings = () => {
  const router = useRouter();
  const userType = userTypeSelector();

  /**
   * Navigates to the calendar page within the myBookings tab.
   *
   * This function uses the router to push a new route to the calendar page
   * located at '/(home)/(tabs)/(myBookings)/calendar'.
   */
  const onCalendarPress = () => {
    router.push('/(home)/(tabs)/(myBookings)/calendar');
  };

  /**
   * Navigates to the astrologer page when the add button is pressed.
   *
   * This function is triggered when the user presses the add button.
   * It uses the router to navigate to the '/(home)/astrologer' route.
   */
  const onAddPress = () => {
    router.navigate('/(home)/astrologer');
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
              tintColor: Colors.black1,
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

  return (
    <View style={styles.container}>
      <TabHeader title="My Bookings" right={renderRight()} />
      <MyBookingList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default MyBookings;
