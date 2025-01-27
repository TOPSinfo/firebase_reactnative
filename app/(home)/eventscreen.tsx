import AstrologerEvent from '@/components/AstrologerEvent';
import Event from '@/components/Event';
import { Colors } from '@/constants/Colors';
import { resetSelectedEvent } from '@/redux/eventSlice';
import { userTypeSelector } from '@/redux/selector';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

const EventScreen = () => {
  const disptach = useDispatch();
  const userType = userTypeSelector();

  useEffect(() => {
    return () => {
      disptach(resetSelectedEvent());
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      {userType == 'user' ? <Event /> : <AstrologerEvent />}
    </View>
  );
};

export default EventScreen;
