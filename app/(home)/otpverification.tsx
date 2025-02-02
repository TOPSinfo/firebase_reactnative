import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Fonts } from '@/constants/Fonts';
import AuthHeader from '@/components/AuthHeader';
import { Images } from '@/constants/Images';
import Button from '@/components/Button';
import SvgImage from '@/components/SvgImage';
import OTPInput from '@/components/OTPInput';
import { router, useLocalSearchParams } from 'expo-router';
import { useOTP } from '@/hooks/useOTPHook';
import { showErrorMessage, showSuccessMessage } from '@/utils/helper';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { userAppColor } from '@/hooks/useAppColor';
import { userTypeSelector } from '@/redux/selector';
import { updateProfile } from '@/services/db';
import { updateUserPhone } from '@/services/auth';

const OtpVerification = () => {
  const [otp, setOtp] = useState('');

  const disptach = useDispatch();
  const { verification, phone, data } = useLocalSearchParams<{
    verification: string;
    phone: string;
    data: any;
  }>();
  const { sendOTP, recaptcha } = useOTP();
  const color = userAppColor();
  const userType = userTypeSelector();
  const [verificationId, setVerificationId] = useState(verification);

  /**
   * Function to handle OTP verification.
   *
   * @returns {Promise<void>} A promise that resolves when the verification is complete.
   */
  const onVerify = async () => {
    Keyboard.dismiss();
    if (otp.length < 6) {
      showErrorMessage('Please enter valid OTP');
      return;
    }
    disptach(setLoading(true));
    const res = await updateUserPhone(verificationId, otp);
    if (res) {
      const res = await updateProfile({
        ...JSON.parse(data),
      });
      disptach(setLoading(false));
      if (res) {
        router.navigate('/(home)/profile');
        showSuccessMessage('Profile updated successfully');
      }
    }
  };

  /**
   * Handles the change event of the OTP input field.
   *
   * @param {string} otp - The new OTP value.
   * @returns {void}
   */
  const onChangeOtp = (otp: string) => {
    setOtp(otp);
  };

  /**
   * Resends the OTP to the user's phone number.
   *
   * @returns {Promise<void>} A promise that resolves when the OTP is successfully resent.
   */
  const onResend = async () => {
    const res = await sendOTP(phone);
    if (res) {
      setVerificationId(res);
      showSuccessMessage('OTP Re-sent successfully');
    }
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
          url={userType == 'user' ? Images.otp : Images.otp_blue}
          style={{ height: verticalScale(225) }}
        />
        <View
          style={{
            marginTop: horizontalScale(50),
            marginBottom: horizontalScale(10),
          }}>
          <Text style={styles.optVerification}>OTP Verification</Text>
        </View>
        <View style={{ marginBottom: horizontalScale(35) }}>
          <Text
            style={{
              fontFamily: Fonts.PoppinsRegular,
              fontSize: moderateScale(12),
              textAlign: 'center',
              color: Colors.grey,
            }}>
            Enter OTP Code sent to +91 {phone}.
          </Text>
        </View>
        <OTPInput onChangeOTP={onChangeOtp} />
        <Button
          title="Verify"
          onPress={onVerify}
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
            Haven't recieved OTP?{' '}
            <Text
              onPress={onResend}
              style={{ fontFamily: Fonts.PoppinsBold, color: color }}>
              Resend
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
  optVerification: {
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black,
    fontSize: moderateScale(32),
    textAlign: 'center',
  },
});

export default OtpVerification;
