import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { moderateScale } from '@/utils/matrix';
import moment from 'moment';
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker";

type DateTimePickerProps = {
    label: string;
    value: string;
    style?: ViewStyle;
    onSelect: (date: Date) => void;
    mode?: 'date' | 'time';
    minDate?: Date;
    maxDate?: Date;
    editable?: boolean;
};

const DateTimePicker = ({ label, value, style, onSelect, mode = 'date', minDate = undefined, maxDate = undefined, editable = false }: DateTimePickerProps) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };


    const handleConfirm = (date: Date) => {
        console.log("A date has been picked: ", date);
        onSelect(date);
        hideDatePicker();
    };

    const handleMinimumDate = () => {
        if (minDate && value && moment(value, 'DD MMM YYYY').toDate() < minDate)
            return moment(value, 'DD MMM YYYY').toDate()
        return minDate
    }

    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity disabled={editable} onPress={showDatePicker} style={style}>
                <Text style={[styles.label, { color: value ? Colors.black1 : Colors.grey }]}>{value ? value : label}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={mode}
                date={value ? moment(value, mode == 'date' ? 'DD MMM YYYY' : 'hh:mm A').toDate() : new Date()}
                minimumDate={handleMinimumDate()}
                maximumDate={maxDate}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1,
        fontSize: moderateScale(12)
    }
})

export default DateTimePicker