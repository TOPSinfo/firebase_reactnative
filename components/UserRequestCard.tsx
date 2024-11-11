import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Button from './Button';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import { updateEventStatus } from '@/services/db';
import { showSuccessMessage } from '@/utils/helper';
import { useDispatch } from 'react-redux';
import { updateBookingStatus } from '@/redux/userSlice';

type UserRequestCardProps = {
  id: string;
  index: number;
  name: string;
  image: string;
  dob: string;
  status: string;
  onPress?: () => void;
};

const UserRequestCard = ({
  id,
  index,
  name,
  image,
  dob,
  status,
  onPress,
}: UserRequestCardProps) => {
  const dispatch = useDispatch();

  const onCardPress = () => {
    onPress && onPress();
  };

  const onAccept = async () => {
    const res = await updateEventStatus(id, 'approved');
    if (res) {
      dispatch(updateBookingStatus({ id, status: 'approved' }));
      showSuccessMessage('Request Accepted');
    }
  };

  const onReject = async () => {
    const res = await updateEventStatus(id, 'rejected');
    if (res) {
      dispatch(updateBookingStatus({ id, status: 'rejected' }));
      showSuccessMessage('Request Rejected');
    }
  };

  const renderButton = () => {
    if (status === 'waiting') {
      return (
        <View style={{ flexDirection: 'row' }}>
          <Button
            title="Accept"
            onPress={onAccept}
            style={{
              flex: 1,
              height: horizontalScale(30),
              marginRight: horizontalScale(5),
              backgroundColor: Colors.green,
            }}
            titleStyle={{
              fontFamily: Fonts.PoppinsRegular,
              fontSize: moderateScale(12),
            }}
          />
          <Button
            title="Reject"
            onPress={onReject}
            style={{ flex: 1, height: horizontalScale(30) }}
            titleStyle={{
              fontFamily: Fonts.PoppinsRegular,
              fontSize: moderateScale(12),
            }}
          />
        </View>
      );
    }
    return (
      <Button
        title={status}
        disabled={true}
        style={{ height: horizontalScale(30) }}
        titleStyle={{
          fontFamily: Fonts.PoppinsRegular,
          fontSize: moderateScale(12),
        }}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onCardPress}
      style={[
        styles.container,
        { marginRight: index % 2 == 0 ? horizontalScale(15) : 0 },
      ]}>
      <View>
        {image ? (
          <SvgImage
            url={image}
            style={{
              height: horizontalScale(82),
              borderRadius: horizontalScale(6),
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImageContainer}>
            <SvgImage
              url={Images.user}
              style={{
                height: horizontalScale(40),
              }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: horizontalScale(6),
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: horizontalScale(3),
          marginBottom: horizontalScale(6),
        }}>
        <Text style={styles.skills} numberOfLines={1}>
          Birth Date: {dob}
        </Text>
      </View>
      {renderButton()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(160),
    backgroundColor: Colors.white,
    marginBottom: horizontalScale(15),
    borderColor: Colors.white2,
    borderWidth: 0.5,
    borderRadius: horizontalScale(5),
    padding: horizontalScale(10),
  },
  name: {
    fontSize: horizontalScale(12),
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black1,
  },
  skills: {
    fontSize: horizontalScale(10),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
  },
  placeholderImageContainer: {
    height: horizontalScale(82),
    borderRadius: horizontalScale(6),
    backgroundColor: Colors.white4,
    justifyContent: 'center',
  },
});

export default UserRequestCard;
