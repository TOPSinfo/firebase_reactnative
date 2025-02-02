import React, { ReactElement, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import SvgImage from '@/components/SvgImage';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Images } from '@/constants/Images';
import { getDefaultHeaderHeight, showErrorMessage } from '@/utils/helper';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import { router } from 'expo-router';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RNModal from '@/components/RNModal';
import RadioOpion from '@/components/RadioOpion';
import { selectedSlotSelector } from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { resetSelectedSlot, setSelectedSlot } from '@/redux/userSlice';
import DateTimePicker from '@/components/DateTimePicker';
import moment from 'moment';
import { saveAppointmentSlot } from '@/services/db';

const weekDays = [
  { label: 'S', value: 'sunday' },
  { label: 'M', value: 'monday' },
  { label: 'T', value: 'tuesday' },
  { label: 'W', value: 'wednesday' },
  { label: 'T', value: 'thursday' },
  { label: 'F', value: 'friday' },
  { label: 'S', value: 'saturday' },
];

const Header = ({
  title,
  right,
  onClose,
}: {
  title: string;
  right?: ReactElement | null;
  onClose: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const statusBarHeight = insets.top;
  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  return (
    <View style={{ height: defaultHeight + 10 }}>
      <View pointerEvents="none" style={{ height: statusBarHeight }} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={onClose}
          style={{ width: '10%', justifyContent: 'center' }}>
          <SvgImage
            url={Images.close}
            style={{ height: horizontalScale(16), width: horizontalScale(16) }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {right ? right : <View style={{ width: '10%' }} />}
      </View>
    </View>
  );
};

const AppointmentSlot = () => {
  const [slotOptionModal, setSlotOptionModal] = useState(false);

  const selectedSlot = selectedSlotSelector();
  const dispatch = useDispatch();

  /**
   * Handles the closing of the appointment slot modal.
   * Dispatches an action to reset the selected slot and navigates back to the previous page.
   *
   * @returns {void}
   */
  const onClose = () => {
    dispatch(resetSelectedSlot());
    router.back();
  };

  /**
   * Handles the save operation for an appointment slot.
   *
   * This function performs validation checks based on the type of the selected slot
   * (Repeat, Weekly, or Custom) and ensures that all required fields are filled and
   * logically correct (e.g., start date is before end date, start time is before end time).
   * If any validation fails, an error message is shown.
   *
   * If all validations pass, the appointment slot is saved and the selected slot is reset.
   *
   * @async
   * @function onSave
   * @returns {Promise<void>} A promise that resolves when the save operation is complete.
   */
  const onSave = async () => {
    if (selectedSlot.type == 'Repeat') {
      if (!selectedSlot.startdate || !selectedSlot.enddate) {
        return showErrorMessage('Please select start date and end date');
      }
      if (selectedSlot.startdate > selectedSlot.enddate) {
        return showErrorMessage('Start date should be less than end date');
      }
      if (!selectedSlot.starttime || !selectedSlot.endtime) {
        return showErrorMessage('Please select start time and end time');
      }
    }
    if (selectedSlot.type == 'Weekly') {
      if (selectedSlot.repeatdays.length == 0) {
        return showErrorMessage('Please select repeat days');
      }
      if (!selectedSlot.starttime || !selectedSlot.endtime) {
        return showErrorMessage('Please select start time and end time');
      }
    }
    if (selectedSlot.type == 'Custom') {
      if (!selectedSlot.startdate) {
        return showErrorMessage('Please select start date');
      }
      if (!selectedSlot.starttime || !selectedSlot.endtime) {
        return showErrorMessage('Please select start time and end time');
      }
    }
    if (
      moment(selectedSlot.endtime, 'hh:mm a').isBefore(
        moment(selectedSlot.starttime, 'hh:mm a')
      )
    ) {
      return showErrorMessage('Start time should be less than end time');
    }
    const res = await saveAppointmentSlot(selectedSlot);
    if (res) {
      dispatch(resetSelectedSlot());
      router.back();
    }
  };

  const renderRight = () => {
    return (
      <TouchableOpacity
        onPress={onSave}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        style={{
          paddingHorizontal: horizontalScale(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.PoppinsRegular,
            color: Colors.white,
            fontSize: moderateScale(16),
          }}>
          Save
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Closes the slot option modal by setting the state to false.
   *
   * This function is typically called when the user wants to close the modal
   * that displays slot options. It updates the state to ensure the modal is
   * no longer visible.
   */
  const onSlotOptionModalClose = () => {
    setSlotOptionModal(false);
  };

  /**
   * Handles the selection of a slot option.
   *
   * @param {string} type - The type of slot selected.
   * @returns {void}
   */
  const onSlotOptionSelect = (type: string) => {
    dispatch(setSelectedSlot({ ...selectedSlot, type }));
    onSlotOptionModalClose();
  };

  const renderSlotOption = () => {
    return (
      <RNModal visible={slotOptionModal} onClose={onSlotOptionModalClose}>
        <TouchableWithoutFeedback>
          <View style={styles.slotOptionContainer}>
            <RadioOpion
              label="Repeat"
              onSelect={() => onSlotOptionSelect('Repeat')}
              isSelected={selectedSlot.type == 'Repeat'}
            />
            <RadioOpion
              label="Weekly"
              onSelect={() => onSlotOptionSelect('Weekly')}
              isSelected={selectedSlot.type == 'Weekly'}
            />
            <RadioOpion
              label="Custom"
              onSelect={() => onSlotOptionSelect('Custom')}
              isSelected={selectedSlot.type == 'Custom'}
            />
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    );
  };

  /**
   * Handles the press event for the slot option.
   * When called, it sets the state to show the slot option modal.
   */
  const onSlotOptionPress = () => {
    setSlotOptionModal(true);
  };

  /**
   * Handles the selection of a start date for an appointment slot.
   *
   * @param {Date} date - The selected start date.
   * @returns {void}
   */
  const onSelectStartDate = (date: Date) => {
    dispatch(
      setSelectedSlot({
        ...selectedSlot,
        startdate: moment(date).format('DD MMM YYYY'),
      })
    );
  };

  /**
   * Handles the selection of the end date for an appointment slot.
   *
   * @param {Date} date - The selected end date.
   * @returns {void}
   */
  const onSelectEndDate = (date: Date) => {
    dispatch(
      setSelectedSlot({
        ...selectedSlot,
        enddate: moment(date).format('DD MMM YYYY'),
      })
    );
  };

  /**
   * Handles the selection of a start time for an appointment slot.
   *
   * @param {Date} date - The selected start time as a Date object.
   * @returns {void}
   */
  const onSelectStartTime = (date: Date) => {
    dispatch(
      setSelectedSlot({
        ...selectedSlot,
        starttime: moment(date).format('hh:mm a'),
      })
    );
  };

  /**
   * Handles the selection of the end time for an appointment slot.
   *
   * @param {Date} date - The selected end time as a Date object.
   * @returns {void}
   */
  const onSelectEndTime = (date: Date) => {
    dispatch(
      setSelectedSlot({
        ...selectedSlot,
        endtime: moment(date).format('hh:mm a'),
      })
    );
  };

  /**
   * Handles the event when a day is pressed.
   * Toggles the presence of the given day in the `repeatdays` array of the selected slot.
   * If the day is already in the array, it removes it; otherwise, it adds it.
   * Dispatches an action to update the selected slot with the new `repeatdays` array.
   *
   * @param day - The day to be toggled in the `repeatdays` array.
   */
  const onDayPress = (day: string) => {
    const repeatdays = selectedSlot.repeatdays.includes(day)
      ? selectedSlot.repeatdays.filter((item: string) => item !== day)
      : [...selectedSlot.repeatdays, day];
    dispatch(setSelectedSlot({ ...selectedSlot, repeatdays }));
  };

  return (
    <View>
      <Header
        title="Appointment Slot"
        onClose={onClose}
        right={renderRight()}
      />
      <View style={{ padding: horizontalScale(25) }}>
        <TouchableOpacity
          onPress={onSlotOptionPress}
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <SvgImage url={Images.calendar} style={styles.fieldIcon} />
            <Text style={styles.text}>{selectedSlot.type}</Text>
          </View>
          <SvgImage
            url={Images.downArrow}
            style={{ height: horizontalScale(12), width: horizontalScale(12) }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {selectedSlot.type == 'Weekly' ? (
          <View
            style={[
              styles.dateContainer,
              { justifyContent: 'center', alignItems: 'center' },
            ]}>
            {weekDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => onDayPress(item.value)}
                style={[
                  styles.dayContainer,
                  {
                    backgroundColor: selectedSlot.repeatdays.includes(
                      item.value
                    )
                      ? Colors.blue
                      : 'transparent',
                  },
                ]}>
                <Text
                  style={[
                    styles.text,
                    {
                      color: selectedSlot.repeatdays.includes(item.value)
                        ? Colors.white
                        : Colors.grey,
                    },
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.dateContainer}>
            <View style={styles.optionContainer}>
              <SvgImage url={Images.calendar} style={styles.icon} />
              <DateTimePicker
                label="Start Date"
                value={selectedSlot.startdate}
                onSelect={onSelectStartDate}
                isSlot={true}
              />
            </View>
            {selectedSlot.type == 'Repeat' ? (
              <View style={{ ...styles.optionContainer, borderLeftWidth: 0.5 }}>
                <SvgImage url={Images.calendar} style={styles.icon} />
                <DateTimePicker
                  label="End Date"
                  value={selectedSlot.enddate}
                  onSelect={onSelectEndDate}
                  isSlot={true}
                />
              </View>
            ) : null}
          </View>
        )}
        <View style={styles.timeContainer}>
          <View style={styles.optionContainer}>
            <SvgImage url={Images.time} style={styles.icon} />
            <DateTimePicker
              mode="time"
              label="Start Time"
              value={selectedSlot.starttime}
              onSelect={onSelectStartTime}
              isSlot={true}
            />
          </View>
          <View
            style={{
              ...styles.optionContainer,
              borderLeftWidth: 0.5,
            }}>
            <SvgImage url={Images.time} style={styles.icon} />
            <DateTimePicker
              mode="time"
              label="End Time"
              value={selectedSlot.endtime}
              onSelect={onSelectEndTime}
              isSlot={true}
            />
          </View>
        </View>
      </View>
      {renderSlotOption()}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.blue,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.white,
    fontFamily: Fonts.PoppinsRegular,
  },
  fieldIcon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
    marginRight: horizontalScale(10),
    tintColor: Colors.grey,
  },
  slotOptionContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: horizontalScale(7),
    borderTopRightRadius: horizontalScale(7),
    padding: horizontalScale(25),
  },
  optionContainer: {
    flexDirection: 'row',
    padding: horizontalScale(25),
    flex: 1,
    borderLeftWidth: 0.5,
    borderColor: Colors.white1,
  },
  icon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
    marginRight: horizontalScale(10),
  },
  text: {
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
    fontSize: moderateScale(12),
  },
  grid: {
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: Colors.white1,
  },
  dateContainer: {
    borderBottomWidth: 0.5,
    borderColor: Colors.white1,
    height: horizontalScale(85),
    flexDirection: 'row',
  },
  timeContainer: {
    height: horizontalScale(85),
    flexDirection: 'row',
  },
  dayContainer: {
    height: horizontalScale(40),
    width: horizontalScale(40),
    borderRadius: horizontalScale(2.5),
    marginHorizontal: horizontalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppointmentSlot;
