import React from 'react';
import { View } from 'react-native';
import DetailsHeader from '@/components/DetailsHeader';
import { Colors } from '@/constants/Colors';
import { horizontalScale } from '@/utils/matrix';
import UserRequestList from '@/components/UserRequestList';

const Users = () => {
  return (
    <View style={{ flex: 1 }}>
      <DetailsHeader title="Users Request" />
      <View
        style={{
          flex: 1,
          padding: horizontalScale(20),
          backgroundColor: Colors.white,
        }}>
        <UserRequestList scrollable={true} />
      </View>
    </View>
  );
};

export default Users;
