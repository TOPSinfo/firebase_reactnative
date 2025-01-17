import { View, Text, StyleSheet, Modal } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useNetInfo } from '@react-native-community/netinfo';
import { StatusBar } from 'expo-status-bar';

const Nointernet = () => {
  const { isConnected } = useNetInfo();

  if (isConnected || isConnected === null) {
    return null;
  }

  return (
    <Modal animationType="slide" visible={!isConnected}>
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
      <StatusBar style="dark" backgroundColor={Colors.white} />
    </Modal>
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
