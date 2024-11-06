import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import AuthHeader from '@/components/AuthHeader';
import Textinput from '@/components/Textinput';
import { Images } from '@/constants/Images';
import Button from '@/components/Button';
import SvgImage from '@/components/SvgImage';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { useOTP } from '@/hooks/useOTPHook';
import { showErrorMessage } from '@/utils/helper';
import { userAppColor } from '@/hooks/useAppColor';
import { userTypeSelector } from '@/redux/selector';

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  acceptTearms: boolean;
};

const SignUp = () => {
  const { control, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      acceptTearms: false,
    },
  });

  const router = useRouter();
  const dispatch = useDispatch();
  const { sendOTP, recaptcha } = useOTP();
  const color = userAppColor();
  const userType = userTypeSelector();

  /**
   * Creates an account with the provided data.
   *
   * @param data - The form data for creating the account.
   * @returns A Promise that resolves to the verification response.
   */
  const onCreateAccount = async (data: FormData) => {
    if (data.acceptTearms == false) {
      showErrorMessage('Please accept tearms and conditions');
      return;
    }
    dispatch(setLoading(true));
    const res = await sendOTP('+91' + data.phone);
    if (res) {
      dispatch(setLoading(false));
      router.navigate({
        pathname: '/(auth)/otp',
        params: {
          verification: res,
          ...data,
          acceptTearms: data.acceptTearms.toString(),
        },
      });
    }
  };

  /**
   * Handles the login button press event.
   */
  const onLoginPress = () => {
    router.navigate('/(auth)/login');
  };

  const onTermsPress = () => {
    setValue('acceptTearms', !getValues('acceptTearms'));
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
        <View style={{ marginVertical: horizontalScale(10) }}>
          <Text style={styles.createAccount}>Create</Text>
          <Text style={styles.createAccount}>Account</Text>
        </View>
        <View>
          <Textinput
            control={control}
            name="fullName"
            icon={Images.user}
            placeholder="Full Name"
            rules={{
              required: 'Full name is required',
            }}
          />
          <Textinput
            control={control}
            name="phone"
            icon={Images.mobile}
            placeholder="Mobile Number"
            keyboardType="number-pad"
            rules={{
              required: 'Phone number is required',
              minLength: {
                value: 10,
                message: 'Invalid phone number',
              },
            }}
          />
          <Textinput
            control={control}
            name="email"
            icon={Images.mail}
            placeholder="Email Address"
            keyboardType="email-address"
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: 'Invalid email address',
              },
            }}
          />
        </View>
        <View
          style={{ marginVertical: horizontalScale(25), flexDirection: 'row' }}>
          <Controller
            control={control}
            defaultValue={false}
            render={({ field: { value } }) => (
              <TouchableOpacity onPress={onTermsPress}>
                <SvgImage
                  url={
                    value
                      ? userType == 'user'
                        ? Images.checkbox
                        : Images.checkbox_blue
                      : Images.checkboxUncheck
                  }
                  style={{
                    height: horizontalScale(12),
                    width: horizontalScale(12),
                    margin: horizontalScale(2.5),
                  }}
                />
              </TouchableOpacity>
            )}
            name="acceptTearms"
          />

          <Text
            style={{
              fontFamily: Fonts.PoppinsRegular,
              fontSize: moderateScale(12),
              color: Colors.grey,
              width: '70%',
              marginLeft: horizontalScale(10),
            }}>
            I agree to <Text style={{ color: color }}>tearm & conditions</Text>{' '}
            and <Text style={{ color: color }}>privacy policy</Text>
          </Text>
        </View>
        <Button
          title="Create Account"
          onPress={handleSubmit(onCreateAccount)}
        />
        <View style={{ marginTop: horizontalScale(20) }}>
          <Text
            style={{
              fontFamily: Fonts.PoppinsRegular,
              fontSize: moderateScale(12),
              textAlign: 'center',
              color: Colors.grey,
            }}>
            Already have an account?{' '}
            <Text
              onPress={onLoginPress}
              style={{ fontFamily: Fonts.PoppinsBold, color: color }}>
              Log In
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
  createAccount: {
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black,
    fontSize: moderateScale(32),
  },
});

export default SignUp;
