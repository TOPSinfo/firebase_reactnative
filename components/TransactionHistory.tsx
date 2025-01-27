import { transactionHistorySelector } from '@/redux/selector';
import React from 'react';
import { FlatList } from 'react-native';
import Transaction from './Transaction';
import { horizontalScale } from '@/utils/matrix';

const TransactionHistory = () => {
  const transactions = transactionHistorySelector();

  const renderItem = ({ item }: { item: any }) => {
    return <Transaction transaction={item} />;
  };

  return (
    <FlatList
      data={transactions}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{
        paddingBottom: horizontalScale(100),
      }}
    />
  );
};

export default TransactionHistory;
