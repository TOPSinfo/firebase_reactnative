import { Colors } from '@/constants/Colors';
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
                    ref={(ref) => (inputsRef.current[index] = ref)}
                    style={styles.otpInput}
                    value={otp[index]}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={(text) => handleChangeText(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
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
        borderWidth: 1,
        borderColor: Colors.blue,
        borderRadius: horizontalScale(8),
        width: horizontalScale(40),
        height: horizontalScale(40),
        textAlign: 'center',
        fontSize: moderateScale(16),
        marginHorizontal: horizontalScale(5),
        backgroundColor: Colors.lightBlue
    },
});

export default OTPInput;
