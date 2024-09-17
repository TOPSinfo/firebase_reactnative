import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import { horizontalScale, moderateScale } from '@/utils/matrix'
import React, { useMemo } from 'react'
import { Text, Pressable, StyleSheet, ViewStyle, TextStyle } from 'react-native'

type ButtonProps = {
    onPress: () => void,
    title: string,
    isTransparent?: boolean,
    style?: ViewStyle,
    titleStyle?: TextStyle
}

const Button = ({ title, onPress, isTransparent = false, style, titleStyle }: ButtonProps) => {


    const buttonStyle = useMemo(() => {
        if (isTransparent) {
            return {
                backgroundColor: 'transparent',
                borderWidth: 0.5,
                borderColor: Colors.orange,
            }
        }
        return {
            backgroundColor: Colors.orange,
        }
    }, [isTransparent]);

    const textStyle = useMemo(() => {
        if (isTransparent) {
            return {
                color: Colors.orange,
            }
        }
        return {
            color: Colors.white,
        }
    }, [isTransparent]);

    return (
        <Pressable style={{ ...styles.button, ...buttonStyle, ...style }} onPress={onPress}>
            <Text style={{ ...styles.text, ...textStyle, ...titleStyle }}>{title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        height: horizontalScale(45),
        backgroundColor: Colors.orange,
        borderRadius: horizontalScale(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: Fonts.PoppinsBold,
        fontSize: moderateScale(15),
        color: Colors.white,
    }
})

export default Button