import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { useRouter } from 'expo-router';
import { showSuccessMessage } from '@/utils/helper';

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = userSelector();
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      email: user?.email || '',
      birthdate: user?.birthdate || '',
      birthtime: user?.birthtime || '',
      birthplace: user?.birthplace || '',
    },
  });

  const onSubmit = async (data: any) => {
    console.log('on submit', data);
    dispatch(setLoading(true));
    const res = await updateProfile({
      ...data,
      profileimage: user.profileimage,
    });
    if (res) {
      showSuccessMessage('Profile updated successfully');
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <DetailsHeader title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileCard isEdit={true} />
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
    </View>
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
