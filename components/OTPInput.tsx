import { Colors } from '@/constants/Colors';
import { userTypeSelector } from '@/redux/selector';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

type OTPInputProps = TextInputProps & {
  length?: number;
  onChangeOTP: (otp: string) => void;
};

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onChangeOTP,
  ...rest
}) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const userType = userTypeSelector();
  const color = userType === 'user' ? Colors.blue : Colors.orange;
  const backgroundColor =
    userType === 'user' ? Colors.lightBlue : Colors.orange1;

  /**
   * Handles the change in text for the OTP input fields.
   *
   * @param text - The text entered in the OTP input field.
   * @param index - The index of the OTP input field being updated.
   *
   * Updates the OTP state with the new text, triggers the onChangeOTP callback with the updated OTP string,
   * and focuses the next input field if the current input field is not the last one and has text.
   */
  const handleChangeText = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);
    onChangeOTP(updatedOtp.join(''));

    if (text && index < length - 1) {
      // Focus the next input
      inputsRef.current[index + 1]?.focus();
    }
  };

  /**
   * Handles the key press event for the OTP input fields.
   *
   * @param e - The key press event.
   * @param index - The index of the OTP input field where the key press event occurred.
   *
   * If the backspace key is pressed on an empty input field and the current input field is not the first one,
   * it focuses the previous input field.
   */
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus the previous input if backspace is pressed on an empty input
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={ref => (inputsRef.current[index] = ref)}
          style={[
            styles.otpInput,
            { borderColor: color, backgroundColor, color },
          ]}
          value={otp[index]}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={text => handleChangeText(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          {...rest}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    borderWidth: 0.5,
    borderRadius: horizontalScale(8),
    width: horizontalScale(40),
    height: horizontalScale(40),
    textAlign: 'center',
    fontSize: moderateScale(16),
    marginHorizontal: horizontalScale(5),
  },
});

export default OTPInput;
