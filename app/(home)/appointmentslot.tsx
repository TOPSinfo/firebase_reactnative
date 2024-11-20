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
import { getDefaultHeaderHeight } from '@/utils/helper';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { router } from 'expo-router';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import RNModal from '@/components/RNModal';
import RadioOpion from '@/components/RadioOpion';

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

  const onClose = () => {
    router.back();
  };

  const renderRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {}}
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

  const renderOption = ({
    icon,
    label,
    value,
    borderLeft,
  }: {
    icon: string;
    label: string;
    value: string;
    borderLeft?: boolean;
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {}}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        style={{
          ...styles.optionContainer,
          borderLeftWidth: borderLeft ? 0.5 : 0,
        }}>
        <SvgImage url={icon} style={styles.icon} />
        <View>
          <Text style={styles.text}>{label}</Text>
          <Text
            style={{
              ...styles.text,
              marginTop: verticalScale(10),
            }}>
            {value}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const onSlotOptionModalClose = () => {
    setSlotOptionModal(false);
  };

  const renderSlotOption = () => {
    return (
      <RNModal visible={slotOptionModal} onClose={onSlotOptionModalClose}>
        <TouchableWithoutFeedback>
          <View style={styles.slotOptionContainer}>
            <RadioOpion label="Repeat" onSelect={() => {}} isSelected={false} />
            <RadioOpion label="Weekly" onSelect={() => {}} isSelected={false} />
            <RadioOpion label="Custom" onSelect={() => {}} isSelected={false} />
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    );
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
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <SvgImage url={Images.calendar} style={styles.fieldIcon} />
            <Text></Text>
          </View>
          <SvgImage
            url={Images.downArrow}
            style={{ height: horizontalScale(12), width: horizontalScale(12) }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <View style={styles.dateContainer}>
          {renderOption({
            icon: Images.calendar,
            label: 'Start Date',
            value: '20-11-2024',
          })}
          {renderOption({
            icon: Images.calendar,
            label: 'End Date',
            value: '20-11-2024',
            borderLeft: true,
          })}
        </View>
        <View style={styles.timeContainer}>
          {renderOption({
            icon: Images.time,
            label: 'Start Time',
            value: '10:00 am',
          })}
          {renderOption({
            icon: Images.time,
            label: 'End Time',
            value: '05:00 pm',
            borderLeft: true,
          })}
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
});

export default AppointmentSlot;
