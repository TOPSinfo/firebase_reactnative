import { horizontalScale, moderateScale } from '@/utils/matrix'
import React, { ReactElement } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native'
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import Button from './Button';

const Header = ({ title, right, onClose }: { title: string, right?: ReactElement, onClose: () => void }) => {
    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();

    const statusBarHeight = insets.top;
    const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight)

    const router = useRouter()

    return (
        <View style={{ height: defaultHeight + 10 }}>
            <View pointerEvents="none" style={{ height: statusBarHeight }} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={onClose} style={{ width: '10%', justifyContent: 'center' }}>
                    <SvgImage url={Images.close} style={{ height: horizontalScale(16), width: horizontalScale(16) }} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={styles.title}>{title}</Text>
                </View>
                {right ? right : <View style={{ width: '10%' }} />}
            </View>
        </View>
    )
}

type EventModalProps = {
    astrologerName: string,
    visible: boolean
    onClose: () => void
}

const EventModal = ({ astrologerName, visible, onClose }: EventModalProps) => {

    const renderRight = () => {
        return (
            <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ paddingHorizontal: horizontalScale(10), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.white, fontSize: moderateScale(16) }}>Save</Text>
            </TouchableOpacity>
        )
    }

    const onBookNow = () => {
        onClose()
    }

    return (
        <Modal visible={visible} onRequestClose={onClose} style={{ flex: 1 }} animationType='slide' statusBarTranslucent>
            <Header title='Add Event' onClose={onClose} right={renderRight()} />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: horizontalScale(20) }}>
                    <View style={[styles.fieldContainer, { marginTop: horizontalScale(10), padding: horizontalScale(15) }]}>
                        <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(12) }}>Astrologer Name</Text>
                        <Text style={{ fontFamily: Fonts.PoppinsBold, color: Colors.black1, fontSize: moderateScale(16) }}>{astrologerName}</Text>
                    </View>
                    <View style={[styles.fieldContainer, { padding: horizontalScale(10) }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <SvgImage url={Images.all_details} style={{ ...styles.fieldIcon, marginTop: horizontalScale(5) }} />
                            <TextInput
                                numberOfLines={3}
                                multiline placeholder='All details'
                                placeholderTextColor={Colors.grey}
                                textAlignVertical='top'
                                style={[styles.input, { height: horizontalScale(55) }]}
                            />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.calendar} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined }]}>Select Date</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.time} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center', width: '45%' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.black1, fontSize: moderateScale(12) }}>Start Time</Text>
                            </TouchableOpacity>
                            <View style={{ borderLeftWidth: 1, borderLeftColor: Colors.grey, height: horizontalScale(55) }} />
                            <TouchableOpacity style={{ justifyContent: 'center', width: '45%', alignItems: 'center' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.black1, fontSize: moderateScale(12) }}>End Time</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.bell} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined }]}>10 Minutes before</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ ...styles.fieldContainer, height: horizontalScale(50), backgroundColor: Colors.white3, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.PoppinsBold, color: Colors.black1, fontSize: moderateScale(12) }} >Personal Details</Text>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(70), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.photo} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.orange, fontSize: moderateScale(12) }}>Upload your photo</Text>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(9) }}>Only JPEG, PNG, and PDF Files</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.user} style={styles.fieldIcon} />
                            <TextInput
                                placeholder='Full Name'
                                placeholderTextColor={Colors.grey}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.calendar} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined }]}>Date of Birth</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.time} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined }]}>Time of Birth</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.place} style={styles.fieldIcon} />
                            <TextInput
                                placeholder='Place of Birth'
                                placeholderTextColor={Colors.grey}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(70), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.kundali} style={styles.fieldIcon} />
                            <TouchableOpacity style={{ justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.orange, fontSize: moderateScale(12) }}>Upload your kundali</Text>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(9) }}>Only JPEG, PNG, and PDF Files</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: horizontalScale(20), marginTop: horizontalScale(20) }}>
                        <Button title='Book Now' onPress={onBookNow} />
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerContainer: {
        flex: 1,
        backgroundColor: Colors.orange,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: horizontalScale(20)
    },
    title: {
        fontSize: moderateScale(18),
        color: Colors.white,
        fontFamily: Fonts.PoppinsRegular
    },
    fieldContainer: {
        paddingHorizontal: horizontalScale(20),
        padding: horizontalScale(10),
        borderBottomWidth: 1,
        borderBottomColor: Colors.white1
    },
    fieldIcon: {
        height: horizontalScale(16),
        width: horizontalScale(16),
        marginRight: horizontalScale(10),
        tintColor: Colors.grey
    },
    input: {
        flex: 1,
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1,
        fontSize: moderateScale(12),
        height: horizontalScale(45)
    }
})

export default EventModal