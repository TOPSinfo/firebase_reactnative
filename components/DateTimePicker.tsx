import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { moderateScale, verticalScale } from '@/utils/matrix';
import moment from 'moment';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type DateTimePickerProps = {
  label: string;
  value: string;
  style?: ViewStyle;
  onSelect: (date: Date) => void;
  mode?: 'date' | 'time';
  minDate?: Date;
  maxDate?: Date;
  editable?: boolean;
  isSlot?: boolean;
};

const DateTimePicker = ({
  label,
  value,
  style,
  onSelect,
  mode = 'date',
  minDate = undefined,
  maxDate = undefined,
  editable = false,
  isSlot = false,
}: DateTimePickerProps) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  /**
   * Function to show the date picker by setting its visibility to true.
   */
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  /**
   * Hides the date picker by setting its visibility state to false.
   */
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  /**
   * Handles the confirmation of the date picker.
   *
   * @param date - The selected date.
   */
  const handleConfirm = (date: Date) => {
    console.log('A date has been picked: ', date);
    onSelect(date);
    hideDatePicker();
  };

  /**
   * Determines the minimum date for the date picker.
   * If the current value is less than the minimum date, it returns the current value.
   * Otherwise, it returns the minimum date.
   *
   * @returns The minimum date for the date picker.
   */
  const handleMinimumDate = () => {
    if (minDate && value && moment(value, 'DD MMM YYYY').toDate() < minDate)
      return moment(value, 'DD MMM YYYY').toDate();
    return minDate;
  };

  const renderLabel = () => {
    if (isSlot) {
      return (
        <TouchableOpacity
          disabled={editable}
          onPress={showDatePicker}
          style={style}>
          <Text style={[styles.label, { color: Colors.grey }]}>{label}</Text>
          <Text
            style={[
              styles.label,
              {
                marginTop: verticalScale(10),
              },
            ]}>
            {value}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          disabled={editable}
          onPress={showDatePicker}
          style={style}>
          <Text
            style={[
              styles.label,
              { color: value ? Colors.black1 : Colors.grey },
            ]}>
            {value ? value : label}
          </Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderLabel()}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        date={
          value
            ? moment(value, mode == 'date' ? 'DD MMM YYYY' : 'hh:mm A').toDate()
            : new Date()
        }
        minimumDate={handleMinimumDate()}
        maximumDate={maxDate}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
    fontSize: moderateScale(12),
  },
});

export default DateTimePicker;
