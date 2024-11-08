import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { userAppColor } from '@/hooks/useAppColor';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import React, { useMemo } from 'react';
import {
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

type ButtonProps = {
  onPress?: () => void;
  title: string;
  isTransparent?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  disabled?: boolean;
};

const Button = ({
  title,
  onPress,
  isTransparent = false,
  style,
  titleStyle,
  disabled,
}: ButtonProps) => {
  const color = userAppColor();

  const buttonStyle = useMemo(() => {
    if (isTransparent) {
      return {
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: color,
      };
    }
    if (disabled) {
      return {
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: Colors.grey,
        opacity: 0.5,
      };
    }
    return {
      backgroundColor: color,
    };
  }, [isTransparent, disabled]);

  const textStyle = useMemo(() => {
    if (isTransparent) {
      return {
        color: color,
      };
    }
    if (disabled) {
      return {
        color: Colors.grey,
      };
    }
    return {
      color: Colors.white,
    };
  }, [isTransparent, disabled]);

  return (
    <Pressable
      disabled={disabled}
      style={{ ...styles.button, ...buttonStyle, ...style }}
      onPress={onPress}>
      <Text style={{ ...styles.text, ...textStyle, ...titleStyle }}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: horizontalScale(45),
    borderRadius: horizontalScale(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.PoppinsBold,
    fontSize: moderateScale(15),
    color: Colors.white,
    textTransform: 'capitalize',
  },
});

export default Button;
