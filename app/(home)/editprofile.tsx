import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import Button from '@/components/Button';
import DateTimePicker from '@/components/DateTimePicker';
import DetailsHeader from '@/components/DetailsHeader';
import ProfileCard from '@/components/ProfileCard';
import SvgImage from '@/components/SvgImage';
import Textinput from '@/components/Textinput';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import { userSelector } from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { updateProfile } from '@/services/db';
import { useNavigation, useRouter } from 'expo-router';
import { showSuccessMessage } from '@/utils/helper';
import { useOTP } from '@/hooks/useOTPHook';

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = userSelector();
  const router = useRouter();
  const { sendOTP, recaptcha } = useOTP();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      email: user?.email || '',
      birthdate: user?.birthdate || '',
      birthtime: user?.birthtime || '',
      birthplace: user?.birthplace || '',
      profileimage: user?.profileimage || '',
    },
  });

  useEffect(() => {
    const backAction = () => {
      onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isDirty]);

  /**
   * Handles the form submission for updating the user profile.
   *
   * @param {any} data - The form data containing user profile information.
   * @returns {Promise<void>} - A promise that resolves when the submission is complete.
   *
   * The function performs the following steps:
   * 1. Dispatches an action to set the loading state to true.
   * 2. Checks if the phone number in the form data is different from the user's current phone number.
   *    - If different, sends an OTP to the new phone number.
   *    - If the OTP is sent successfully, navigates to the OTP verification page with the necessary parameters.
   * 3. If the phone number is the same, updates the user profile with the provided data.
   *    - If the profile update is successful, shows a success message and navigates back to the previous page.
   */
  const onSubmit = async (data: any) => {
    dispatch(setLoading(true));
    if (data.phone !== user.phone) {
      const res = await sendOTP(data.phone);
      if (res) {
        dispatch(setLoading(false));
        router.navigate({
          pathname: '/otpverification',
          params: {
            verification: res,
            phone: data.phone,
            data: JSON.stringify({
              ...data,
              profileimage: encodeURIComponent(data.profileimage),
            }),
          },
        });
      }
    } else {
      const res = await updateProfile({
        ...data,
        profileimage: data.profileimage,
      });
      if (res) {
        showSuccessMessage('Profile updated successfully');
        router.back();
      }
    }
  };

  /**
   * Handles the back navigation action.
   * If there are unsaved changes (isDirty is true), it shows an alert to confirm
   * whether the user wants to discard the changes. If the user confirms, it navigates back.
   * If there are no unsaved changes, it directly navigates back.
   */
  const onBack = () => {
    if (isDirty) {
      Alert.alert('Alert', 'Do you want to discard the changes?', [
        {
          text: 'Yes',
          onPress: () => {
            router.back();
          },
        },
        {
          text: 'No',
        },
      ]);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      enabled={Platform.OS == 'ios'}
      behavior="padding">
      <DetailsHeader backPress={onBack} title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="profileimage"
          render={({ field: { onChange, value } }) => (
            <ProfileCard isEdit={true} profile={value} onChange={onChange} />
          )}
        />
        <View style={{ paddingHorizontal: horizontalScale(25) }}>
          <Textinput
            control={control}
            name="fullname"
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
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="birthdate"
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgImage
                    url={Images.date_of_birth}
                    style={styles.fieldIcon}
                  />
                  <DateTimePicker
                    label="Date of Birth"
                    value={value}
                    onSelect={date => {
                      onChange(moment(date).format('DD MMM YYYY'));
                    }}
                    maxDate={new Date()}
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="birthtime"
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgImage url={Images.time} style={styles.fieldIcon} />
                  <DateTimePicker
                    label="Time of Birth"
                    mode={'time'}
                    value={value}
                    onSelect={time => {
                      onChange(moment(time).format('hh:mm A'));
                    }}
                  />
                </View>
              )}
            />
          </View>
          <Textinput
            control={control}
            name="birthplace"
            icon={Images.place}
            placeholder="Place of Birth"
          />
          <View style={{ marginVertical: verticalScale(30) }}>
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          </View>
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
  },
  fieldContainer: {
    padding: horizontalScale(10),
    borderWidth: 0.5,
    borderColor: Colors.white1,
    borderRadius: horizontalScale(8),
    height: horizontalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(18),
    marginTop: horizontalScale(15),
  },
  fieldIcon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
    marginRight: horizontalScale(15),
    tintColor: Colors.grey,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
    fontSize: moderateScale(12),
    height: horizontalScale(45),
  },
});

export default EditProfile;
