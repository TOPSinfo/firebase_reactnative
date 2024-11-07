import React from 'react';
import { FlatList } from 'react-native';
import AstrologerCard from './AstrologerCard';
import { horizontalScale } from '@/utils/matrix';

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
        name={item.fullName}
        ratings={item.ratings}
        skills={item.skills}
        image={item.image}
      />
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
    />
  );
};

export default AstrologersList;
