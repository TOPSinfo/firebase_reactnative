import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import SvgImage from './SvgImage';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Fonts } from '@/constants/Fonts';
import { useController, UseControllerProps } from 'react-hook-form';
import { userTypeSelector } from '@/redux/selector';

type TextinputProps = {
  placeholder: string;
  icon: string | number;
  control: any;
  name: string;
  multiline?: boolean;
  rules?: UseControllerProps['rules'];
};

const transformValue = moderateScale(-16);
const fontSize = moderateScale(12);
const focusedFontSize = moderateScale(10);

const Textinput = ({
  name,
  control,
  rules,
  placeholder,
  icon,
  multiline,
  ...rest
}: TextinputProps & TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name, rules });

  const userType = userTypeSelector();
  const color = userType === 'user' ? Colors.blue : Colors.orange;

  // Animation for label position and size
  const labelStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isFocused || value ? transformValue : 0, {
            duration: 200,
          }),
        },
      ],
      fontSize: withTiming(isFocused || value ? focusedFontSize : fontSize, {
        duration: 200,
      }),
    };
  });

  // Animation for border color
  const borderStyle = useAnimatedStyle(() => {
    if (error?.message) {
      return {
        borderColor: Colors.red,
      };
    } else {
      return {
        borderColor: withTiming(isFocused ? color : Colors.white1, {
          duration: 200,
        }),
      };
    }
  });

  /**
   * Handles the focus event on the text input.
   * Sets the `isFocused` state to `true` when the input gains focus.
   */
  const onFocus = () => {
    setIsFocused(true);
  };

  /**
   * Handles the blur event for the text input.
   * Sets the `isFocused` state to `false` when the input loses focus.
   */
  const onBlur = () => {
    setIsFocused(false);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        borderStyle,
        { height: multiline ? horizontalScale(150) : horizontalScale(50) },
      ]}>
      <View style={{ paddingTop: horizontalScale(15) }}>
        <SvgImage
          url={icon}
          style={{ height: horizontalScale(15), width: horizontalScale(15) }}
        />
      </View>
      <View style={styles.labelContainer}>
        {isFocused || value ? (
          <Animated.Text style={[styles.label, labelStyle]}>
            {placeholder}
          </Animated.Text>
        ) : null}
      </View>
      <TextInput
        placeholder={!isFocused ? placeholder : ''}
        placeholderTextColor={Colors.grey}
        style={[
          styles.textInput,
          {
            color: isFocused ? color : Colors.black,
            height: multiline ? horizontalScale(140) : horizontalScale(45),
            marginTop: multiline ? horizontalScale(10) : 0,
          },
        ]}
        textAlignVertical={multiline ? 'top' : 'center'}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        multiline={multiline}
        {...rest}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    borderColor: Colors.white1,
    borderRadius: horizontalScale(8),
    height: horizontalScale(50),
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(18),
    marginTop: horizontalScale(15),
  },
  textInput: {
    flex: 1,
    marginLeft: horizontalScale(15),
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
  },
  labelContainer: {
    position: 'absolute',
    left: 40,
    top: 10,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    color: Colors.grey,
  },
});

export default Textinput;
