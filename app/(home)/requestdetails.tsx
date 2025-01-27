import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import DetailsHeader from '@/components/DetailsHeader';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import SvgImage from '@/components/SvgImage';
import { useDispatch } from 'react-redux';
import { resetSelectedEvent } from '@/redux/eventSlice';
import { selectedEventSelector } from '@/redux/selector';
import { Fonts } from '@/constants/Fonts';
import { Images } from '@/constants/Images';
import { getUserPhoneNumber, updateEventStatus } from '@/services/db';
import { setLoading } from '@/redux/loadingSlice';
import Button from '@/components/Button';
import { updateBookingStatus } from '@/redux/userSlice';
import { showSuccessMessage } from '@/utils/helper';
import { router } from 'expo-router';

const Requestdetails = () => {
  const dispatch = useDispatch();
  const selectedEvent = selectedEventSelector();

  /**
   * Fetches the user's phone number based on the selected event's UID.
   * Dispatches a loading state before making the request.
   *
   * @async
   * @function fetchUserPhone
   * @returns {Promise<void>} A promise that resolves when the phone number is fetched.
   */
  const fetchUserPhone = async () => {
    dispatch(setLoading(true));
    await getUserPhoneNumber(selectedEvent.uid);
  };

  useEffect(() => {
    fetchUserPhone();
    return () => {
      dispatch(resetSelectedEvent());
    };
  }, []);

  /**
   * Handles the acceptance of a request.
   *
   * This function updates the status of the selected event to 'approved' by calling the `updateEventStatus` function.
   * If the update is successful, it dispatches an action to update the booking status in the state,
   * shows a success message, and navigates back to the previous page.
   *
   * @async
   * @function onAccept
   * @returns {Promise<void>} A promise that resolves when the request has been processed.
   */
  const onAccept = async () => {
    const res = await updateEventStatus(selectedEvent.id, 'approved');
    if (res) {
      dispatch(
        updateBookingStatus({ id: selectedEvent.id, status: 'approved' })
      );
      showSuccessMessage('Request Accepted');
      router.back();
    }
  };

  /**
   * Handles the rejection of an event request.
   *
   * This function updates the status of the selected event to 'rejected' by calling the `updateEventStatus` function.
   * If the status update is successful, it dispatches an action to update the booking status in the state,
   * shows a success message, and navigates back to the previous page.
   *
   * @async
   * @function onReject
   * @returns {Promise<void>} A promise that resolves when the rejection process is complete.
   */
  const onReject = async () => {
    const res = await updateEventStatus(selectedEvent.id, 'rejected');
    if (res) {
      dispatch(
        updateBookingStatus({ id: selectedEvent.id, status: 'rejected' })
      );
      showSuccessMessage('Request Rejected');
      router.back();
    }
  };

  const renderInfo = (
    icon: string,
    label: string,
    value: string,
    bottomBorder = true
  ) => {
    return (
      <View
        style={[
          styles.detailContainer,
          { borderBottomWidth: bottomBorder ? 0.5 : 0 },
        ]}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <SvgImage url={icon} style={styles.icon} />
            <Text style={styles.label}>{label}</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text>:</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DetailsHeader title="Request Details" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(25) }}>
        <View style={{ padding: horizontalScale(20) }}>
          <SvgImage
            url={selectedEvent.photo}
            style={{
              height: verticalScale(225),
              borderRadius: horizontalScale(6),
            }}
            resizeMode="cover"
          />
          <View style={{ marginTop: horizontalScale(16) }}>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                fontSize: moderateScale(18),
                color: Colors.black2,
              }}>
              {selectedEvent.fullname}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            About {selectedEvent.fullname}
          </Text>
        </View>
        <View>
          {renderInfo(Images.user, 'Full Name', selectedEvent.fullname)}
          {renderInfo(Images.mobile, 'Mobile Number', selectedEvent.phone)}
          {renderInfo(
            Images.date_of_birth,
            'Date of Birth',
            selectedEvent.birthdate
          )}
          {renderInfo(Images.time, 'Time of Birth', selectedEvent.birthtime)}
          {renderInfo(
            Images.place,
            'Place of Birth',
            selectedEvent.birthplace,
            false
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Booking Details</Text>
        </View>
        {renderInfo(Images.calendar, 'Date', selectedEvent.date)}
        <View style={styles.detailContainer}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <SvgImage url={Images.time} style={styles.icon} />
            <Text style={styles.label}>Time</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <Text>:</Text>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text style={styles.label}>Start Time</Text>
                <Text
                  style={[styles.value, { marginTop: horizontalScale(10) }]}>
                  {selectedEvent.starttime}
                </Text>
              </View>
              <View>
                <Text style={styles.label}>End Time</Text>
                <Text
                  style={[styles.value, { marginTop: horizontalScale(10) }]}>
                  {selectedEvent.endtime}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {renderInfo(
          Images.all_details,
          'Description',
          selectedEvent.description
        )}
        {selectedEvent.status == 'waiting' ? (
          <View style={{ flexDirection: 'row', padding: horizontalScale(20) }}>
            <Button
              title="Accept"
              onPress={onAccept}
              style={{
                flex: 1,
                marginRight: horizontalScale(5),
                backgroundColor: Colors.green,
              }}
            />
            <Button title="Reject" onPress={onReject} style={{ flex: 1 }} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  section: {
    backgroundColor: Colors.white5,
    padding: horizontalScale(20),
  },
  sectionLabel: {
    fontSize: moderateScale(12),
    color: Colors.black2,
    fontFamily: Fonts.PoppinsRegular,
  },
  detailContainer: {
    flexDirection: 'row',
    padding: horizontalScale(20),
    borderBottomWidth: 0.5,
    borderColor: Colors.white1,
  },
  icon: {
    height: verticalScale(16),
    width: verticalScale(16),
    tintColor: Colors.grey,
  },
  label: {
    fontSize: moderateScale(12),
    color: Colors.grey,
    fontFamily: Fonts.PoppinsRegular,
    marginLeft: horizontalScale(12),
  },
  value: {
    fontSize: moderateScale(12),
    color: Colors.black2,
    fontFamily: Fonts.PoppinsRegular,
    marginLeft: horizontalScale(12),
  },
});

export default Requestdetails;
