import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import { apponitmentSlotSelector } from '@/redux/selector';
import { deleteAppointmentSlot } from '@/services/db';
import { showSuccessMessage } from '@/utils/helper';
import { useDispatch } from 'react-redux';
import { setSelectedSlot } from '@/redux/userSlice';

const AppointmentSlot = () => {
  const appointmentSlots = apponitmentSlotSelector();

  const dispatch = useDispatch();

  // Function to handle the press event for adding a new appointment slot
  const onAddPress = () => {
    router.navigate('/(home)/appointmentslot');
  };

  const renderEmpty = () => {
    return (
      <TouchableOpacity onPress={onAddPress} style={styles.emptyContainer}>
        <SvgImage url={Images.plus} style={styles.plusIcon} />
        <Text style={styles.label}>Add Appointment Slot</Text>
      </TouchableOpacity>
    );
  };

  /**
   * Handles the press event for editing an appointment slot.
   * Dispatches an action to set the selected slot and navigates to the appointment slot page.
   *
   * @param {any} slot - The appointment slot to be edited.
   */
  const onEditPress = (slot: any) => {
    dispatch(setSelectedSlot(slot));
    router.navigate('/(home)/appointmentslot');
  };

  /**
   * Deletes an appointment slot by its ID and shows a success message if the deletion is successful.
   *
   * @param {string} id - The ID of the appointment slot to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  const onDelete = async (id: string) => {
    const res = await deleteAppointmentSlot(id);
    if (res) {
      showSuccessMessage('Appointment Slot deleted successfully');
    }
  };

  /**
   * Handles the delete button press event for an appointment slot.
   * Displays a confirmation alert before proceeding with the deletion.
   *
   * @param {string} id - The unique identifier of the appointment slot to be deleted.
   * @returns {Promise<void>} A promise that resolves when the alert is dismissed.
   */
  const onDeletePress = async (id: string) => {
    Alert.alert(
      'Delete Appointment Slot',
      'Are you sure you want to delete this slot?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDelete(id),
        },
      ]
    );
  };

  /**
   * Renders the day or range of days for a given appointment slot.
   *
   * @param {any} slot - The appointment slot object. It can have different types:
   *   - If the slot type is 'Custom', it returns the start date.
   *   - If the slot type is 'Repeat', it returns a string with the start date and end date.
   *   - Otherwise, it returns a comma-separated string of repeat days.
   *
   * @returns {string} - The formatted date or range of dates for the appointment slot.
   */
  const renderSlotDay = (slot: any) => {
    if (slot.type == 'Custom') return slot.startdate;
    if (slot.type == 'Repeat') return slot.startdate + ' to ' + slot.enddate;
    return slot.repeatdays.join(', ');
  };

  const renderSlot = () => {
    return (
      <View>
        {appointmentSlots.map((slot: any, index: number) => {
          return (
            <View key={index} style={styles.slotContainer}>
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.time}>{slot.starttime}</Text>
                <Text style={styles.day}>to</Text>
                <Text style={styles.time}>{slot.endtime}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  paddingLeft: horizontalScale(20),
                }}>
                <Text style={styles.time}>Appointment Slot {index + 1}</Text>
                <Text style={[styles.day, { marginTop: horizontalScale(2.5) }]}>
                  {renderSlotDay(slot)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => onEditPress(slot)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <SvgImage
                    url={Images.edit}
                    style={{ ...styles.icon, marginRight: horizontalScale(16) }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDeletePress(slot.timeslotid)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <SvgImage url={Images.delete} style={styles.icon} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Appointment Slot</Text>
        <TouchableOpacity
          onPress={onAddPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ paddingRight: horizontalScale(5) }}>
          <SvgImage url={Images.plus} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: horizontalScale(15) }}>
        {appointmentSlots.length > 0 ? renderSlot() : renderEmpty()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black1,
  },
  emptyContainer: {
    flexDirection: 'row',
    height: verticalScale(70),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey,
    borderStyle: 'dashed',
    borderRadius: horizontalScale(10),
  },
  plusIcon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
    tintColor: Colors.grey,
    marginRight: horizontalScale(10),
  },
  label: {
    fontFamily: Fonts.PoppinsMedium,
    fontSize: moderateScale(12),
    color: Colors.grey,
  },
  slotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: horizontalScale(10),
    backgroundColor: Colors.white3,
    borderRadius: horizontalScale(3),
    padding: horizontalScale(10),
  },
  time: {
    fontFamily: Fonts.PoppinsMedium,
    fontSize: moderateScale(12),
    color: Colors.grey,
  },
  day: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(9),
    color: Colors.grey,
  },
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
    tintColor: Colors.grey,
  },
});

export default AppointmentSlot;
