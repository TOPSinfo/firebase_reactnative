import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import moment from 'moment';

const Transaction = ({ transaction }: { transaction: any }) => {
  const isDebit = transaction.transactiontype == 'debit';

  /**
   * Renders the transaction type based on the transaction's type.
   *
   * @returns {string} A string indicating whether the transaction is a debit or credit.
   */
  const renderTransactionType = () => {
    if (transaction.transactiontype === 'debit') {
      return `Sent from`;
    } else if (transaction.transactiontype === 'credit') {
      return 'Received in';
    }
  };

  /**
   * Renders the appropriate icon based on the transaction type and payment type.
   *
   * @returns {string} The URL of the icon image.
   */
  const renderIcon = () => {
    if (isDebit) {
      if (transaction.paymenttype === 'wallet') {
        return Images.wallet;
      }
      return Images.bank;
    } else {
      return Images.wallet;
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.iconContainer}>
          <SvgImage
            url={isDebit ? Images.debit : Images.credit}
            style={{ height: verticalScale(16), width: verticalScale(16) }}
          />
        </View>
        <View style={{ marginLeft: horizontalScale(15) }}>
          <Text style={styles.title}>
            {isDebit
              ? `Paid to ${transaction.astrologername}`
              : 'Money added to wallet'}
          </Text>
          <Text style={styles.subtitle}>
            {moment(transaction.createdat.seconds * 1000).format(
              'DD MMM YYYY, hh:mm A'
            )}
          </Text>
        </View>
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title}>{isDebit ? '-' : '+'}</Text>
          <SvgImage url={Images.rupee} style={styles.rupee} />
          <Text style={styles.title}>{transaction.amount}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.subtitle}>{renderTransactionType()}</Text>
          <SvgImage url={renderIcon()} style={styles.wallet} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.white1,
    paddingHorizontal: horizontalScale(20),
    height: verticalScale(70),
  },
  iconContainer: {
    height: verticalScale(35),
    width: verticalScale(35),
    borderWidth: 0.5,
    borderColor: Colors.white1,
    borderRadius: verticalScale(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    color: Colors.black1,
    lineHeight: moderateScale(22),
  },
  subtitle: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(9),
    color: Colors.grey,
  },
  rupee: {
    height: horizontalScale(10),
    width: horizontalScale(10),
    tintColor: Colors.black1,
    marginHorizontal: horizontalScale(2.5),
  },
  wallet: {
    height: horizontalScale(8),
    width: horizontalScale(8),
    marginLeft: horizontalScale(5),
  },
});

export default Transaction;
