import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import UserRequestCard from './UserRequestCard';
import { myBookingsSelector } from '@/redux/selector';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useDispatch } from 'react-redux';
import { setSelectedEvent } from '@/redux/eventSlice';
import { router } from 'expo-router';

const UserRequestList = ({ scrollable = false }: { scrollable?: boolean }) => {
  const dispatch = useDispatch();
  const myBookings = myBookingsSelector();

  const onRequestPress = (item: any) => {
    dispatch(setSelectedEvent(item));
    router.navigate('/(home)/requestdetails');
  };
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <UserRequestCard
        id={item.id}
        index={index}
        name={item.fullname}
        dob={item.birthdate}
        image={item.photo}
        status={item.status}
        onPress={() => onRequestPress(item)}
      />
    );
  };

  const listEmptyComponent = () => {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: moderateScale(12),
            color: Colors.grey,
            fontFamily: Fonts.PoppinsRegular,
          }}>
          Currently no user requests for you.
        </Text>
      </View>
    );
  };

  return (
    <FlatList
      scrollEnabled={scrollable}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: scrollable ? horizontalScale(100) : 0,
      }}
      data={scrollable ? myBookings : myBookings.slice(0, 4)}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={listEmptyComponent}
    />
  );
};

export default UserRequestList;
