import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { userTypeSelector } from '@/redux/selector';

const RadioOpion = ({
  label,
  onSelect,
  isSelected,
}: {
  label: string;
  onSelect: () => void;
  isSelected: boolean;
}) => {
  const userType = userTypeSelector();

  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        flexDirection: 'row',
        marginBottom: horizontalScale(2.5),
        alignItems: 'center',
        paddingVertical: horizontalScale(10),
      }}>
      <SvgImage
        url={
          isSelected
            ? userType == 'user'
              ? Images.radioSelected
              : Images.radioSelected_blue
            : Images.radio
        }
        style={{
          height: verticalScale(20),
          width: verticalScale(20),
          marginRight: horizontalScale(10),
        }}
      />
      <View style={{ marginLeft: horizontalScale(13) }}>
        <Text
          style={{
            fontFamily: Fonts.PoppinsRegular,
            fontSize: moderateScale(12),
            color: Colors.black1,
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioOpion;
