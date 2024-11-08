import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SvgImage from './SvgImage';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Images } from '@/constants/Images';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useRouter } from 'expo-router';
import { userTypeSelector } from '@/redux/selector';
import { userAppColor } from '@/hooks/useAppColor';

const Banner = () => {
  const router = useRouter();
  const userType = userTypeSelector();
  const color = userAppColor();

  const onPress = () => {
    if (userType == 'user') {
      router.navigate('/(home)/astrologer');
    } else {
      router.navigate('/(home)/users');
    }
  };

  return (
    <View>
      <SvgImage
        url={userType == 'user' ? Images.banner : Images.banner_blue}
        style={styles.banner}
      />
      <View style={styles.container}>
        <Text style={styles.appointment}>Appointment</Text>
        <Text style={styles.label}>
          {userType == 'user'
            ? 'Connect with astrologer by booking an appointment.'
            : 'Connect with users by accepting appointment request.'}
        </Text>
        <View style={{ alignItems: 'flex-start' }}>
          <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text
              style={[
                styles.appointment,
                { color: color, fontSize: moderateScale(9) },
              ]}>
              {userType == 'user'
                ? 'Book Appointment'
                : 'Appointment Requests '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    height: horizontalScale(185),
    width: horizontalScale(335),
    marginTop: verticalScale(25),
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    padding: horizontalScale(20),
  },
  appointment: {
    fontSize: moderateScale(12),
    color: Colors.white,
    fontFamily: Fonts.PoppinsRegular,
  },
  label: {
    fontSize: moderateScale(12),
    color: Colors.white,
    fontFamily: Fonts.PoppinsBold,
    width: '70%',
    marginVertical: verticalScale(8),
  },
  button: {
    backgroundColor: Colors.white,
    borderRadius: horizontalScale(8),
    padding: horizontalScale(10),
  },
});

export default Banner;
