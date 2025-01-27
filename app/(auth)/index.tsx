import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { setUserType } from '@/redux/userSlice';

const Start = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  /**
   * Handles the sign up action.
   */
  const onSignUp = () => {
    router.navigate('/(auth)/signup');
  };

  /**
   * Handles the login action.
   */
  const onLogin = (userType: string) => {
    dispatch(setUserType(userType));
    router.navigate('/(auth)/login');
  };

  return (
    <ImageBackground source={Images.background} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: horizontalScale(20) }}>
        <SvgImage
          url={Images.createAccount}
          style={styles.createAccountImage}
        />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.createAccount}>Create Account</Text>
        </View>
        {/* <View style={styles.buttonContainer}>
                    <Button title='Sign up' onPress={onSignUp} style={{ width: '35%' }} />
                    <Button title='Log in' onPress={onLogin} isTransparent={true} style={{ width: '32%', marginLeft: horizontalScale(20), backgroundColor: Colors.white }} />
                </View> */}
        <Button
          title="Login with Astrologer"
          onPress={() => onLogin('astrologer')}
          style={{
            width: '100%',
            marginTop: horizontalScale(25),
            backgroundColor: Colors.blue,
          }}
        />
        <Button
          title="Login with User"
          onPress={() => onLogin('user')}
          style={{
            width: '100%',
            marginTop: horizontalScale(35),
            backgroundColor: Colors.orange,
          }}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  createAccountImage: {
    height: verticalScale(350),
    width: horizontalScale(300),
    marginVertical: horizontalScale(50),
  },
  createAccount: {
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black,
    fontSize: moderateScale(30),
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: horizontalScale(30),
    paddingHorizontal: horizontalScale(10),
    justifyContent: 'center',
  },
});

export default Start;
