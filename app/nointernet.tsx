import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const Nointernet = () => {
  return (
    <View style={style.container}>
      <MaterialIcons
        name="wifi-off"
        size={verticalScale(120)}
        color={Colors.grey}
      />
      <Text style={style.title}>No Internet Connection</Text>
      <Text style={style.subTitle}>
        Please check your network connection and try again
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: horizontalScale(20),
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.black1,
    fontFamily: Fonts.PoppinsMedium,
    marginTop: verticalScale(10),
  },
  subTitle: {
    fontSize: moderateScale(14),
    color: Colors.grey,
    fontFamily: Fonts.PoppinsRegular,
    marginTop: verticalScale(10),
    textAlign: 'center',
  },
});

export default Nointernet;
