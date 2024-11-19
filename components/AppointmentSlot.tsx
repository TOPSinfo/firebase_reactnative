import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const AppointmentSlot = () => {
  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        <SvgImage url={Images.plus} style={styles.plusIcon} />
        <Text style={styles.label}>Add Appointment Slot</Text>
      </View>
    );
  };

  return (
    <View style={{ marginTop: horizontalScale(15) }}>
      {/* <FlatList
        data={[]}
        renderItem={() => (
          <View>
            <Text>Appointment Slot</Text>
          </View>
        )}
        ListEmptyComponent={renderEmpty}
      /> */}
      {renderEmpty()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
});

export default AppointmentSlot;
