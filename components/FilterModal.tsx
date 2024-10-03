import React, { useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import { Colors } from '@/constants/Colors'
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import { Fonts } from '@/constants/Fonts'
import SvgImage from './SvgImage'
import { Images } from '@/constants/Images'

type FilterModalProps = {
    visible: boolean
    onClose: () => void
}

const filterOptions: {
    title: string,
    options: string[],
    selectMultiple: boolean,
    selected: string | string[]
}[] = [
        {
            title: 'Sort by',
            options: ['Popularity', 'Experience: High to Low', 'Experience: Low to High', 'Price: High to Low', 'Price: Low to High'],
            selectMultiple: false,
            selected: ''
        },
        {
            title: 'Skill',
            options: ['All', 'Cartomancy', 'Counselor', 'Face Reading', 'Horary', 'KP', 'Lal Kitab', 'Life Coach'],
            selectMultiple: true,
            selected: []
        },
        {
            title: 'Language',
            options: ['English', 'Hindi', 'Gujarati', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'],
            selectMultiple: true,
            selected: []
        },
        {
            title: 'Gender',
            options: ['Male', 'Female'],
            selectMultiple: false,
            selected: ''
        }
    ]

const FilterModal = ({ visible, onClose }: FilterModalProps) => {
    const [currentOption, setCurrentOption] = useState(0)
    const [options, setOptions] = useState(filterOptions)

    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();

    const statusBarHeight = insets.top;
    const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight)

    const onReset = () => {
        setOptions(filterOptions)
        onClose()
    }

    const onApply = () => {
        onClose()
    }

    const onChangeOption = (index: number) => {
        setCurrentOption(index)
    }

    const onSelect = (item: string) => {
        if (options[currentOption].selectMultiple) {
            const selected = options[currentOption].selected || []
            if (selected.includes(item)) {
                const index = selected.indexOf(item)
                if (Array.isArray(selected)) {
                    selected.splice(index, 1)
                }
            } else {
                if (Array.isArray(selected)) {
                    selected.push(item)
                }
            }
            setOptions([...options])
        } else {
            options[currentOption].selected = item
            setOptions([...options])
        }

    }

    const renderRadio = (option: string) => {
        if (options[currentOption].selectMultiple) {
            return (
                <SvgImage url={options[currentOption].selected.includes(option) ? Images.radioChecked : Images.radio} style={{ height: verticalScale(20), width: verticalScale(20), marginRight: horizontalScale(10) }} />
            )
        }
        return (
            <SvgImage url={options[currentOption].selected.includes(option) ? Images.radioSelected : Images.radio} style={{ height: verticalScale(20), width: verticalScale(20), marginRight: horizontalScale(10) }} />
        )
    }

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType='fade'>
            <View style={{ height: defaultHeight + 10, borderBottomWidth: 1, borderBottomColor: Colors.white1 }}>
                <View pointerEvents="none" style={{ height: statusBarHeight }} />
                <View style={styles.container}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.title}>Sort & Filter</Text>
                    </View>
                </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ width: '35%', backgroundColor: Colors.white3 }}>
                    {options.map((option, index) => (
                        <TouchableOpacity onPress={() => onChangeOption(index)} key={index} style={{ padding: horizontalScale(20), backgroundColor: index == currentOption ? Colors.orange1 : Colors.white3 }}>
                            <Text style={{ fontSize: moderateScale(12), color: index == currentOption ? Colors.orange : Colors.black2, fontFamily: Fonts.PoppinsMedium }}>{option.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ width: '65%', backgroundColor: Colors.white }}>
                    {options[currentOption].options.map((option, index) => (
                        <TouchableOpacity onPress={() => onSelect(option)} key={index} style={{ paddingHorizontal: horizontalScale(20), paddingVertical: horizontalScale(15), flexDirection: 'row', alignItems: 'center' }}>
                            {renderRadio(option)}
                            <Text style={{ fontSize: moderateScale(12), color: Colors.black2, fontFamily: Fonts.PoppinsMedium }}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            <View style={{ borderTopWidth: 1, borderTopColor: Colors.white1, justifyContent: 'space-around', flexDirection: 'row', padding: horizontalScale(10) }}>
                <TouchableOpacity onPress={onReset} style={styles.button}>
                    <Text style={styles.reset}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onApply} style={[styles.button, { backgroundColor: Colors.orange }]}>
                    <Text style={styles.apply}>Apply</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(20)
    },
    title: {
        fontSize: moderateScale(18),
        color: Colors.black2,
        fontFamily: Fonts.PoppinsRegular
    },
    button: {
        height: horizontalScale(45),
        borderRadius: horizontalScale(3),
        width: '40%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    apply: {
        fontSize: moderateScale(16),
        color: Colors.white,
        fontFamily: Fonts.PoppinsBold
    },
    reset: {
        fontSize: moderateScale(16),
        color: Colors.orange,
        fontFamily: Fonts.PoppinsRegular
    }
})

export default FilterModal