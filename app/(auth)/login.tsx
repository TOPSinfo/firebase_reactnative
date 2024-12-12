import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import AuthHeader from '@/components/AuthHeader';
import Textinput from '@/components/Textinput';
import { Images } from '@/constants/Images';
import Button from '@/components/Button';
import SvgImage from '@/components/SvgImage';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { useOTP } from '@/hooks/useOTPHook';
import { isUserExist } from '@/services/db';
import { userAppColor } from '@/hooks/useAppColor';
import { userTypeSelector } from '@/redux/selector';

type FormData = {
  phone: string;
};

const Login = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      phone: '',
    },
  });
  const { sendOTP, recaptcha } = useOTP();
  const dispatch = useDispatch();

  const router = useRouter();
  const color = userAppColor();
  const userType = userTypeSelector();

  /**
   * Handles the login functionality.
   *
   * @param data - The form data containing the user's login information.
   * @returns A Promise that resolves when the login process is complete.
   */
  const onLogin = async (data: FormData) => {
    console.log('Data', data);
    dispatch(setLoading(true));
    const isExist = await isUserExist('+91' + data.phone);
    if (isExist) {
      const res = await sendOTP('+91' + data.phone);
      if (res) {
        dispatch(setLoading(false));
        router.navigate({
          pathname: '/(auth)/otp',
          params: { verification: res, isLogin: '1', ...data },
        });
      }
    }
  };

  /**
   * Handles the press event of the signup button.
   */
  const onSignupPress = () => {
    router.navigate('/(auth)/signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled={Platform.OS == 'ios'}
      behavior="padding">
      <AuthHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <SvgImage
          url={userType == 'user' ? Images.login : Images.login_blue}
          style={{ height: verticalScale(225) }}
        />
        <View
          style={{
            marginTop: horizontalScale(50),
            marginBottom: horizontalScale(10),
          }}>
          <Text style={styles.login}>Log in</Text>
        </View>
        <Textinput
          control={control}
          name="phone"
          icon={Images.mobile}
          placeholder="Mobile Number"
          keyboardType="number-pad"
          maxLength={10}
          rules={{
            required: 'Phone number is required',
            maxLength: {
              value: 10,
              message: 'Invalid phone number',
            },
          }}
        />
        <Button
          title="Log in"
          onPress={handleSubmit(onLogin)}
          style={{ marginTop: horizontalScale(35) }}
        />
        <View style={{ marginTop: horizontalScale(20) }}>
          <Text
            style={{
              fontFamily: Fonts.PoppinsRegular,
              fontSize: moderateScale(12),
              textAlign: 'center',
              color: Colors.grey,
            }}>
            Not registered yet?{' '}
            <Text
              onPress={onSignupPress}
              style={{ fontFamily: Fonts.PoppinsBold, color: color }}>
              Sign Up
            </Text>{' '}
          </Text>
        </View>
      </ScrollView>
      {recaptcha}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: horizontalScale(20),
  },
  login: {
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black,
    fontSize: moderateScale(32),
    textAlign: 'center',
  },
});

export default Login;
