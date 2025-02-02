import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import TabHeader from '@/components/TabHeader';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { Fonts } from '@/constants/Fonts';
import { userSelector } from '@/redux/selector';
import Button from '@/components/Button';
import RazorpayCheckout from 'react-native-razorpay';
import { showErrorMessage } from '@/utils/helper';
import { router, useFocusEffect } from 'expo-router';
import { topupWallet } from '@/services/db';

const options = ['10', '15', '20', '50', '100', '500', '5000'];

const Option = ({ value, onPress }: { value: string; onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.option}>
      <SvgImage
        url={Images.rupee}
        style={{
          height: moderateScale(10),
          width: moderateScale(10),
          tintColor: Colors.orange,
        }}
      />
      <Text style={styles.optionValue}>{value}</Text>
    </TouchableOpacity>
  );
};

const Wallet = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [amount, setAmount] = useState('');

  const userdata = userSelector();

  useFocusEffect(
    useCallback(() => {
      setAmount('');
    }, [])
  );

  /**
   * Handles the press event for an option and sets the selected amount.
   *
   * @param {string} value - The value of the selected option.
   */
  const onOptionPress = (value: string) => {
    setAmount(value);
  };

  /**
   * Event handler for the focus event.
   * Sets the `isFocused` state to `true` when the element gains focus.
   */
  const onFocus = () => {
    setIsFocused(true);
  };

  /**
   * Event handler for the blur event.
   * This function is called when the input field loses focus.
   * It sets the `isFocused` state to `false`.
   */
  const onBlur = () => {
    setIsFocused(false);
  };

  /**
   * Handles the payment process using Razorpay.
   *
   * This function sets up the payment options and opens the Razorpay checkout interface.
   *
   * @async
   * @function handlePayment
   * @returns {Promise<void>} A promise that resolves when the Razorpay checkout is opened.
   *
   * @description The payment options include details such as the description, image, currency, API key, amount,
   * user details (email, contact, name), and theme color. The amount is multiplied by 100 to convert it to the smallest currency unit.
   *
   * @example
   * ```typescript
   * handlePayment().then(() => {
   *   console.log('Payment process initiated');
   * }).catch((error) => {
   *   console.error('Error initiating payment:', error);
   * });
   * ```
   */
  const handlePayment = async () => {
    var options: any = {
      description: 'Wallet Topup',
      image:
        'https://firebasestorage.googleapis.com/v0/b/sales-astrology-reactnative.appspot.com/o/images%2Fastro_logo.png?alt=media&token=da65b3f5-0bba-463c-b891-1cfd7381eab9',
      currency: 'INR',
      key: process.env.EXPO_PUBLIC_RZP_API_KEY_TEST, // Your api key
      amount: Number(amount) * 100,
      name: 'AstroYodha',
      prefill: {
        email: userdata.email || '',
        contact: userdata.phone || '',
        name: userdata.fullname || '',
      },
      theme: { color: Colors.orange },
    };
    return RazorpayCheckout.open(options);
  };

  /**
   * Handles the top-up button press event.
   *
   * This function validates the entered amount, initiates the payment process,
   * and updates the wallet balance upon successful payment. If the payment is
   * unsuccessful, it displays an error message.
   *
   * @async
   * @function onTopupPress
   * @returns {Promise<void>} A promise that resolves when the top-up process is complete.
   *
   * @throws Will throw an error if the payment process fails.
   */
  const onTopupPress = async () => {
    if (!/^\d+(\.\d+)?$/.test(amount)) {
      showErrorMessage('Please enter valid amount');
      return;
    }
    try {
      const paymentRes = await handlePayment();
      const data = {
        amount: Number(amount),
        transactionid: paymentRes.razorpay_payment_id,
        paymenttype: 'paymentgateway',
        username: userdata.fullname,
      };
      const res = await topupWallet(data);
      if (res) {
        router.navigate('/thankyou');
      }
    } catch (error) {
      console.log('Payment Error', error);
      showErrorMessage('Payment unsuccessful. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TabHeader title="Wallet" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: horizontalScale(150) }}
        showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: horizontalScale(20) }}>
          <View>
            <SvgImage
              url={Images.wallet_card}
              style={{ height: horizontalScale(138), width: '100%' }}
            />
            <View style={styles.walletCardContainer}>
              <Text style={styles.availableBalance}>Available Balance</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgImage
                  url={Images.rupee_white}
                  style={{
                    height: moderateScale(24),
                    width: moderateScale(24),
                  }}
                />
                <Text style={styles.balance}>{userdata.walletbalance}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginTop: horizontalScale(25) }}>
            <Text style={styles.topupWallet}>Topup wallet</Text>
            <View
              style={[
                styles.inputContainer,
                { borderColor: isFocused ? Colors.orange : Colors.white1 },
              ]}>
              <SvgImage
                url={Images.rupee}
                style={{
                  height: horizontalScale(12),
                  width: horizontalScale(12),
                  tintColor: Colors.black1,
                }}
              />
              <TextInput
                placeholder="Enter amount"
                placeholderTextColor={Colors.grey}
                style={styles.textInput}
                keyboardType="numeric"
                value={amount}
                onChangeText={text => setAmount(text.trim())}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </View>
          </View>
          <View style={{ marginTop: horizontalScale(25) }}>
            <Text style={styles.recommended}>Recommended</Text>
            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
              }}>
              {options.map(option => (
                <Option
                  key={option}
                  value={option}
                  onPress={() => onOptionPress(option)}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: horizontalScale(25),
          paddingBottom: horizontalScale(45),
        }}>
        <Button
          title="Proceed to topup"
          disabled={!amount}
          style={{
            backgroundColor: !amount ? Colors.grey : Colors.orange,
            opacity: 1,
          }}
          titleStyle={{ color: Colors.white }}
          onPress={onTopupPress}
        />
      </View>
    </View>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  walletCardContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  availableBalance: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.white,
  },
  balance: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(45),
    marginLeft: horizontalScale(5),
    fontFamily: Fonts.PoppinsBold,
    color: Colors.white,
  },
  topupWallet: {
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black1,
    fontSize: moderateScale(18),
  },
  inputContainer: {
    borderWidth: 0.5,
    borderColor: Colors.white1,
    borderRadius: horizontalScale(8),
    height: horizontalScale(50),
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(18),
    marginTop: horizontalScale(15),
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: horizontalScale(5),
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(16),
    height: horizontalScale(45),
  },
  recommended: {
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
    fontSize: moderateScale(12),
  },
  option: {
    borderWidth: 0.5,
    borderColor: Colors.orange,
    borderRadius: horizontalScale(4),
    height: horizontalScale(30),
    width: horizontalScale(65),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(15),
    marginTop: horizontalScale(15),
  },
  optionValue: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.orange,
    lineHeight: moderateScale(16),
    marginLeft: horizontalScale(2.5),
  },
});
