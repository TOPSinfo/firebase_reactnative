import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@/utils/helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Thankyou = () => {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const statusBarHeight = insets.top;
  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  const onClose = () => {
    router.back();
  };

  const onHome = () => {
    router.navigate('/(home)/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: 'flex-end',
          height: defaultHeight + 10,
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={onClose}>
          <SvgImage
            url={Images.close}
            style={{
              height: verticalScale(16),
              width: verticalScale(16),
              tintColor: Colors.grey,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ alignItems: 'center' }}>
        <SvgImage
          url={Images.thank_you}
          style={{ height: verticalScale(165), width: verticalScale(165) }}
        />
        <Text
          style={{
            fontSize: moderateScale(32),
            color: Colors.black1,
            fontFamily: Fonts.PoppinsBold,
          }}>
          Thank you
        </Text>
      </View>
      <TouchableOpacity
        onPress={onHome}
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: moderateScale(12),
            fontFamily: Fonts.PoppinsRegular,
            color: Colors.grey,
          }}>
          Go to home
        </Text>
        <MaterialCommunityIcons
          name="arrow-right"
          color={Colors.grey}
          size={moderateScale(16)}
          style={{ marginLeft: horizontalScale(15) }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    padding: horizontalScale(25),
  },
});

export default Thankyou;
