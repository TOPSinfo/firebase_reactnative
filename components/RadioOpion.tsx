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
  isMultiple,
}: {
  label: string;
  onSelect: () => void;
  isSelected: boolean;
  isMultiple?: boolean;
}) => {
  const userType = userTypeSelector();

  /**
   * Returns the appropriate image based on the selection state, user type, and whether multiple selections are allowed.
   *
   * @returns {string} The image path corresponding to the current state.
   */
  const returnImage = () => {
    if (isSelected) {
      if (userType == 'user') {
        if (isMultiple) return Images.radioChecked;
        return Images.radioSelected;
      } else {
        if (isMultiple) return Images.radioChecked_blue;
        return Images.radioSelected_blue;
      }
    } else {
      return Images.radio;
    }
  };

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
        url={returnImage()}
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
