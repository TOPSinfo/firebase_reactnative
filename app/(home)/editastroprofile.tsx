import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
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
import { horizontalScale, moderateScale } from '@/utils/matrix';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import {
  languageListSelector,
  specialityListSelector,
  userSelector,
} from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { getAppointmentSlots, updateProfile } from '@/services/db';
import { useRouter } from 'expo-router';
import { showSuccessMessage } from '@/utils/helper';
import AppointmentSlot from '@/components/AppointmentSlot';
import MultiselectModal from '@/components/MultiselectModal';
import { useOTP } from '@/hooks/useOTPHook';

const EditAstroProfile = () => {
  const [languageModal, setLanguageModal] = useState(false);
  const [specialityModal, setSpecialityModal] = useState(false);

  const dispatch = useDispatch();
  const user = userSelector();
  const router = useRouter();
  const { sendOTP, recaptcha } = useOTP();

  const languageList = languageListSelector();
  const specialityList = specialityListSelector();
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
      languages: user?.languages || [],
      speciality: user?.speciality || [],
      price: user?.price || '',
      experience: user?.experience || '',
      aboutyou: user?.aboutyou || '',
      profileimage: user?.profileimage || '',
    },
  });

  /**
   * Fetches the available appointment slots asynchronously.
   * Utilizes the `getAppointmentSlots` function to retrieve the data.
   *
   * @returns {Promise<void>} A promise that resolves when the appointment slots have been fetched.
   */
  const fetchAppointmentSlots = async () => {
    await getAppointmentSlots();
  };

  useEffect(() => {
    fetchAppointmentSlots();
  }, []);

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
   * Handles the form submission for updating the user's astrology profile.
   *
   * @param {any} data - The form data containing the user's profile information.
   * @returns {Promise<void>} - A promise that resolves when the submission is complete.
   *
   * The function performs the following steps:
   * 1. Dispatches an action to set the loading state to true.
   * 2. Checks if the phone number in the form data is different from the user's current phone number.
   *    - If different, sends an OTP to the new phone number.
   *      - If the OTP is sent successfully, navigates to the OTP verification page with the necessary parameters.
   *    - If the phone number is the same, updates the user's profile directly.
   *      - If the profile update is successful, shows a success message and navigates back to the previous page.
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
   * Closes the language modal by setting the state to false.
   */
  const onLanguageModalClose = () => {
    setLanguageModal(false);
  };

  /**
   * Opens the language modal by setting the state to true.
   */
  const onLanguagePress = () => {
    setLanguageModal(true);
  };

  /**
   * Closes the speciality modal by setting the state to false.
   *
   * @returns {void}
   */
  const onSpecialityModalClose = () => {
    setSpecialityModal(false);
  };

  /**
   * Handles the press event for the speciality button.
   * Sets the state to show the speciality modal.
   */
  const onSpecialityPress = () => {
    setSpecialityModal(true);
  };

  const filterLabel = (
    value: string[],
    list: { id: string; name: string }[]
  ) => {
    return value
      .map(val => {
        const item = list.find(item => item.id === val);
        if (item) return item.name;
      })
      .filter(Boolean);
  };

  const renderRight = () => {
    return (
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        style={{
          paddingHorizontal: horizontalScale(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.PoppinsRegular,
            color: Colors.white,
            fontSize: moderateScale(16),
          }}>
          Save
        </Text>
      </TouchableOpacity>
    );
  };

  /**
   * Handles the back navigation action. If there are unsaved changes (isDirty is true),
   * it prompts the user with an alert to confirm if they want to discard the changes.
   * If the user confirms, it navigates back. If there are no unsaved changes, it directly navigates back.
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
      <DetailsHeader
        backPress={onBack}
        title="Profile"
        rightOption={renderRight()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Controller
          control={control}
          name="profileimage"
          render={({ field: { onChange, value } }) => (
            <ProfileCard isEdit={true} profile={value} onChange={onChange} />
          )}
        />
        <View style={{ padding: horizontalScale(25) }}>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontFamily: Fonts.PoppinsMedium,
              color: Colors.black1,
            }}>
            Basic Details
          </Text>
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
        </View>
        <View style={{ paddingHorizontal: horizontalScale(25) }}>
          <Text
            style={{
              fontSize: moderateScale(18),
              fontFamily: Fonts.PoppinsMedium,
              color: Colors.black1,
            }}>
            Other Details
          </Text>
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="languages"
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgImage url={Images.language} style={styles.fieldIcon} />
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      height: horizontalScale(35),
                    }}
                    onPress={onLanguagePress}>
                    {value.length ? (
                      <Text
                        numberOfLines={1}
                        style={[styles.label, { color: Colors.black1 }]}>
                        {filterLabel(value, languageList).join(', ')}
                      </Text>
                    ) : (
                      <Text style={styles.label}>Language</Text>
                    )}
                  </TouchableOpacity>
                  <MultiselectModal
                    visible={languageModal}
                    onClose={onLanguageModalClose}
                    list={languageList}
                    value={value}
                    onSubmit={selected => {
                      onChange(selected);
                    }}
                  />
                </View>
              )}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="speciality"
              render={({ field: { onChange, value } }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <SvgImage url={Images.skills} style={styles.fieldIcon} />
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      height: horizontalScale(35),
                    }}
                    onPress={onSpecialityPress}>
                    {value.length ? (
                      <Text
                        numberOfLines={1}
                        style={[styles.label, { color: Colors.black1 }]}>
                        {filterLabel(value, specialityList).join(', ')}
                      </Text>
                    ) : (
                      <Text style={styles.label}>Astrology Type</Text>
                    )}
                  </TouchableOpacity>
                  <MultiselectModal
                    visible={specialityModal}
                    onClose={onSpecialityModalClose}
                    list={specialityList}
                    value={value}
                    onSubmit={selected => {
                      onChange(selected);
                    }}
                  />
                </View>
              )}
            />
          </View>
          <Textinput
            control={control}
            name="price"
            icon={Images.rupee}
            placeholder="Price per min"
            keyboardType="number-pad"
          />
          <Textinput
            control={control}
            name="experience"
            icon={Images.experience}
            placeholder="Experience"
          />
          <Textinput
            control={control}
            name="aboutyou"
            icon={Images.all_details}
            numberOfLines={3}
            multiline
            placeholder="About you"
            placeholderTextColor={Colors.grey}
            textAlignVertical="top"
          />
        </View>
        <View
          style={{
            padding: horizontalScale(25),
          }}>
          <AppointmentSlot />
          <View style={{ marginTop: horizontalScale(25) }}>
            <Button title="Save" onPress={handleSubmit(onSubmit)} />
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
  label: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    color: Colors.grey,
  },
});

export default EditAstroProfile;
