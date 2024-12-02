import React, { useEffect } from 'react';
import { View } from 'react-native';
import DetailsHeader from '@/components/DetailsHeader';
import TransactionHistory from '@/components/TransactionHistory';
import { Colors } from '@/constants/Colors';
import { getTransactionHistory } from '@/services/db';

const transactionshistory = () => {
  const fetchTransactionHistory = async () => {
    await getTransactionHistory();
  };

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <DetailsHeader title="Transaction History" />
      <TransactionHistory />
    </View>
  );
};

export default transactionshistory;
