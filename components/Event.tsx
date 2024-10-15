import { horizontalScale, moderateScale } from '@/utils/matrix'
import React, { ReactElement, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback } from 'react-native'
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDefaultHeaderHeight } from '@react-navigation/elements'
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import Button from './Button';
import RNModal from './RNModal';
import RadioOpion from './RadioOpion';
import DateTimePicker from './DateTimePicker';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch } from 'react-redux';
import { onChangeEventData } from '@/redux/eventSlice';
import moment from 'moment';
import { selectedEventSelector } from '@/redux/selector';


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
    const [notificationModal, setNotificationModal] = useState(false)
    const disptach = useDispatch()

    const selectedEvent = selectedEventSelector()

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

    const onSelectNotification = () => {
        setNotificationModal(true)
    }

    const onNotificaitonModalClose = () => {
        setNotificationModal(false)
    }

    const onNotificationSelect = (notification: string) => {
        disptach(onChangeEventData({ notification }))
        setNotificationModal(false)
    }

    const renderNotificationModal = () => {
        return <RNModal visible={notificationModal} onClose={onNotificaitonModalClose} >
            <TouchableWithoutFeedback>
                <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: horizontalScale(7), borderTopRightRadius: horizontalScale(7), padding: horizontalScale(25) }}>
                    <RadioOpion label='No notification' onSelect={() => onNotificationSelect('1')} isSelected={selectedEvent.notification == '1'} />
                    <RadioOpion label='5 minutes before' onSelect={() => onNotificationSelect('2')} isSelected={selectedEvent.notification == '2'} />
                    <RadioOpion label='10 minutes before' onSelect={() => onNotificationSelect('3')} isSelected={selectedEvent.notification == '3'} />
                    <RadioOpion label='15 minutes before' onSelect={() => onNotificationSelect('4')} isSelected={selectedEvent.notification == '4'} />
                    <RadioOpion label='1 hour before' onSelect={() => onNotificationSelect('5')} isSelected={selectedEvent.notification == '5'} />
                    <RadioOpion label='1 day before' onSelect={() => onNotificationSelect('6')} isSelected={selectedEvent.notification == '6'} />
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    }

    const onUploadPhoto = async () => {
        DocumentPicker.getDocumentAsync().then((res) => {
            console.log('document picker res', res)
        })
    }

    const onUploadKundali = async () => {
        DocumentPicker.getDocumentAsync().then((res) => {
            console.log('document picker res', res)
        })
    }

    const onChangeDetails = (text: string) => {
        disptach(onChangeEventData({ description: text }))
    }

    const onSelectDate = (date: Date) => {
        disptach(onChangeEventData({ date: moment(date).format('DD MMM YYYY') }))
    }

    const onSelectStartTime = (date: Date) => {
        disptach(onChangeEventData({ startTime: moment(date).format('hh:mm A') }))
    }

    const onSelectEndTime = (date: Date) => {
        disptach(onChangeEventData({ endTime: moment(date).format('hh:mm A') }))
    }

    const onChangeFullName = (text: string) => {
        disptach(onChangeEventData({ fullName: text }))
    }

    const onSelectDateOfBirth = (date: Date) => {
        disptach(onChangeEventData({ dob: moment(date).format('DD MMM YYYY') }))
    }

    const onSelectTimeOfBirth = (date: Date) => {
        disptach(onChangeEventData({ tob: moment(date).format('hh:mm A') }))
    }

    const onChangePlaceOfBirth = (text: string) => {
        disptach(onChangeEventData({ place: text }))
    }

    const notificationLabel = () => {
        switch (selectedEvent.notification) {
            case '1':
                return 'No notification'
            case '2':
                return '5 minutes before'
            case '3':
                return '10 minutes before'
            case '4':
                return '15 minutes before'
            case '5':
                return '1 hour before'
            case '6':
                return '1 day before'
            default:
                return '10 minutes before'
        }
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
                                onChangeText={onChangeDetails}
                                textAlignVertical='top'
                                value={selectedEvent.description}
                                style={[styles.input, { height: horizontalScale(55) }]}
                            />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.calendar} style={styles.fieldIcon} />
                            <DateTimePicker label='Select Date' value={selectedEvent.date} onSelect={onSelectDate} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.time} style={styles.fieldIcon} />
                            <DateTimePicker label='Start Time' mode={'time'} value={selectedEvent.startTime} onSelect={onSelectStartTime} />
                            <View style={{ borderLeftWidth: 1, borderLeftColor: Colors.grey, height: horizontalScale(55) }} />
                            <DateTimePicker label='End Time' mode={'time'} value={selectedEvent.endTime} onSelect={onSelectEndTime} style={{ alignItems: 'center' }} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.bell} style={styles.fieldIcon} />
                            <TouchableOpacity onPress={onSelectNotification} style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined }]}>{notificationLabel()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ ...styles.fieldContainer, height: horizontalScale(50), backgroundColor: Colors.white3, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.PoppinsBold, color: Colors.black1, fontSize: moderateScale(12) }} >Personal Details</Text>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(70), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.photo} style={styles.fieldIcon} />
                            <TouchableOpacity onPress={onUploadPhoto} style={{ justifyContent: 'center' }}>
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
                                onChangeText={onChangeFullName}
                                style={styles.input}
                                value={selectedEvent.fullName}
                            />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.calendar} style={styles.fieldIcon} />
                            <DateTimePicker label='Date of Birth' value={selectedEvent.dob} onSelect={onSelectDateOfBirth} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.time} style={styles.fieldIcon} />
                            <DateTimePicker label='Time of Birth' mode={'time'} value={selectedEvent.tob} onSelect={onSelectTimeOfBirth} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.place} style={styles.fieldIcon} />
                            <TextInput
                                placeholder='Place of Birth'
                                placeholderTextColor={Colors.grey}
                                onChangeText={onChangePlaceOfBirth}
                                value={selectedEvent.place}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(70), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.kundali} style={styles.fieldIcon} />
                            <TouchableOpacity onPress={onUploadKundali} style={{ justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.orange, fontSize: moderateScale(12) }}>Upload your kundali</Text>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(9) }}>Only JPEG, PNG, and PDF Files</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: horizontalScale(20), marginTop: horizontalScale(20) }}>
                        <Button title='Book Now' onPress={onBookNow} />
                    </View>
                </ScrollView>
                {renderNotificationModal()}
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