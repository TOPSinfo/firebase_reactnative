import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native'
import { Colors } from '@/constants/Colors'
import { horizontalScale, moderateScale } from '@/utils/matrix'
import SvgImage from './SvgImage'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Fonts } from '@/constants/Fonts'
import { useController, UseControllerProps } from 'react-hook-form'


type TextinputProps = {
    placeholder: string
    icon: string | number
    control: any
    name: string
    rules?: UseControllerProps['rules']
}

const transformValue = moderateScale(-16)
const fontSize = moderateScale(12)
const focusedFontSize = moderateScale(10)

const Textinput = ({ name, control, rules, placeholder, icon, ...rest }: TextinputProps & TextInputProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const { field: { onChange, value }, fieldState: { error } } = useController({ control, name, rules })


    // Animation for label position and size
    const labelStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: withTiming(isFocused || value ? transformValue : 0, { duration: 200 }) }],
            fontSize: withTiming(isFocused || value ? focusedFontSize : fontSize, { duration: 200 }),
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
                borderColor: withTiming(isFocused ? Colors.blue : Colors.white1, { duration: 200 }),
            };
        }
    });

    const onFocus = () => {
        setIsFocused(true);
    }

    const onBlur = () => {
        setIsFocused(false);
    }

    return (
        <Animated.View style={[styles.container, borderStyle]}>
            <View>
                <SvgImage url={icon} style={{ height: horizontalScale(15), width: horizontalScale(15) }} />
            </View>
            <View style={styles.labelContainer}>
                {isFocused ? <Animated.Text style={[styles.label, labelStyle]}>
                    {placeholder}
                </Animated.Text> : null}
            </View>
            <TextInput
                placeholder={!isFocused ? placeholder : ''}
                placeholderTextColor={Colors.grey}
                style={[styles.textInput, { color: isFocused ? Colors.blue : Colors.black }]}
                onFocus={onFocus}
                onBlur={onBlur}
                onChangeText={onChange}
                {...rest}
            />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderColor: Colors.white1,
        borderRadius: horizontalScale(8),
        height: horizontalScale(50),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(18),
        marginTop: horizontalScale(15)
    },
    textInput: {
        flex: 1,
        height: horizontalScale(45),
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
        color: Colors.grey
    },
})

export default Textinput


