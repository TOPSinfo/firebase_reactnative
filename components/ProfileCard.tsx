import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { userSelector, userTypeSelector } from '@/redux/selector';
import { Fonts } from '@/constants/Fonts';
import { getSunSign } from '@/utils/helper';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { updateProfileImage } from '@/redux/userSlice';
import { userAppColor } from '@/hooks/useAppColor';

const ProfileCard = ({ isEdit = false }) => {
  const router = useRouter();
  const user = userSelector();
  const dispatch = useDispatch();

  const sunSign = getSunSign(user?.fullname);
  const userType = userTypeSelector();
  const color = userAppColor();

  const onEditPress = async () => {
    if (isEdit) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        dispatch(updateProfileImage({ profileimage: result.assets[0].uri }));
      }
    } else {
      if (userType == 'user') {
        router.navigate('/(home)/editprofile');
      } else {
        router.navigate('/(home)/editastroprofile');
      }
    }
  };

  const renderContent = () => {
    if (!isEdit) {
      if (userType == 'user') {
        return (
          <View style={styles.optionContainer}>
            <View style={styles.option}>
              <SvgImage
                url={Images.date_of_birth}
                style={{
                  height: verticalScale(16),
                  width: verticalScale(16),
                  tintColor: Colors.blue,
                }}
              />
              <Text style={styles.optionLabel}>Date of Birth</Text>
              <Text style={styles.value}>
                {user.birthdate ?? 'DD MMM YYYY'}
              </Text>
            </View>
            <View style={styles.option}>
              <SvgImage
                url={Images.sun_sign}
                style={{ height: verticalScale(16), width: verticalScale(16) }}
              />
              <Text style={styles.optionLabel}>Sun sign</Text>
              <Text style={styles.value}>{sunSign}</Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={styles.optionContainer}>
            <View style={styles.option}>
              <Text style={[styles.value, { fontSize: moderateScale(16) }]}>
                {user.rating}
              </Text>
              <Text
                style={[styles.optionLabel, { fontSize: moderateScale(10) }]}>
                Rating
              </Text>
            </View>
            <View style={styles.option}>
              <Text style={[styles.value, { fontSize: moderateScale(16) }]}>
                {user.consults}
              </Text>
              <Text
                style={[styles.optionLabel, { fontSize: moderateScale(10) }]}>
                Consults
              </Text>
            </View>
          </View>
        );
      }
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        { height: isEdit ? verticalScale(210) : verticalScale(320) },
      ]}>
      <View style={[styles.profileContainer]}>
        <View style={styles.profile}>
          {user.profileimage ? (
            <SvgImage
              url={user.profileimage}
              style={{
                height: verticalScale(105),
                width: verticalScale(105),
                borderRadius: verticalScale(105),
              }}
              resizeMode="cover"
            />
          ) : (
            <SvgImage
              url={Images.user}
              style={{ height: verticalScale(40), width: verticalScale(40) }}
            />
          )}
          <TouchableOpacity
            onPress={onEditPress}
            style={[styles.edit, { backgroundColor: color }]}>
            <SvgImage
              url={Images.edit}
              style={{ height: verticalScale(8), width: verticalScale(8) }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: verticalScale(15) }}>
          <Text style={styles.name}>{user.fullname}</Text>
        </View>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white3,
    height: verticalScale(320),
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: horizontalScale(13),
  },
  profile: {
    height: verticalScale(105),
    width: verticalScale(105),
    borderRadius: verticalScale(105),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white6,
  },
  edit: {
    height: verticalScale(17),
    width: verticalScale(17),
    borderRadius: verticalScale(17),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: verticalScale(8),
    right: horizontalScale(8),
  },
  name: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black1,
  },
  optionContainer: {
    marginTop: verticalScale(3),
    flex: 0.35,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 0.495,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
  },
  value: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
    marginTop: verticalScale(2.5),
  },
});

export default ProfileCard;
