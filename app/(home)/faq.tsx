import DetailsHeader from '@/components/DetailsHeader';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { View } from 'react-native';

const Faq = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <DetailsHeader title="FAQ" />
    </View>
  );
};

export default Faq;
