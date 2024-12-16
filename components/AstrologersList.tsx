import React from 'react';
import { FlatList, Text, View } from 'react-native';
import AstrologerCard from './AstrologerCard';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

const AstrologersList = ({
  data,
  scrollable = false,
}: {
  data: [];
  scrollable?: boolean;
}) => {
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <AstrologerCard
        id={item.id}
        index={index}
        name={item.fullname}
        ratings={item.rating}
        skills={item.speciality}
        image={item.profileimage}
      />
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: moderateScale(12),
            color: Colors.grey,
            fontFamily: Fonts.PoppinsRegular,
          }}>
          No astrologers found
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
      data={scrollable ? data : data.slice(0, 4)}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

export default AstrologersList;
