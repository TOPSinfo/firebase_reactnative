import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix'
import React, { ReactElement, useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';
import { onChangeEventData, resetSelectedEvent } from '@/redux/eventSlice';
import moment from 'moment';
import { selectedEventSelector } from '@/redux/selector';
import { setLoading } from '@/redux/loadingSlice';
import { createBooking } from '@/services/db';
import { showErrorMessage, showSuccessMessage } from '@/utils/helper';


const Header = ({ title, right, onClose }: { title: string, right?: ReactElement, onClose: () => void }) => {
    const insets = useSafeAreaInsets();
    const frame = useSafeAreaFrame();

    const statusBarHeight = insets.top;
    const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight)

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

const Event = () => {
    const [notificationModal, setNotificationModal] = useState(false)
    const [editable, setEditable] = useState(true)
    const disptach = useDispatch()
    const selectedEvent = selectedEventSelector()
    const router = useRouter()

    console.log('Selected event', selectedEvent)

    useEffect(() => {
        if (selectedEvent.id) {
            setEditable(false)
        }
    }, [])

    const onClose = () => {
        router.back()
    }

    const onEditPress = () => {
        setEditable(true)
    }

    const renderRight = () => {
        if (selectedEvent.id && (selectedEvent.status == 'completed' || selectedEvent.status == 'rejected')) return null

        if (selectedEvent.id) {
            if (editable) {
                return (
                    <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ paddingHorizontal: horizontalScale(10), alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.white, fontSize: moderateScale(16) }}>Update</Text>
                    </TouchableOpacity>
                )

            }
            return (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={onEditPress} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ paddingHorizontal: horizontalScale(10), alignItems: 'center', justifyContent: 'center' }} >
                        <SvgImage url={Images.edit} style={{ height: horizontalScale(16), width: horizontalScale(16) }} />
                    </TouchableOpacity>
                    <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ paddingHorizontal: horizontalScale(10), alignItems: 'center', justifyContent: 'center' }} >
                        <SvgImage url={Images.delete} style={{ height: horizontalScale(16), width: horizontalScale(16) }} />
                    </TouchableOpacity>
                </View>
            )
        }
        return (
            <TouchableOpacity onPress={onBookNow} hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} style={{ paddingHorizontal: horizontalScale(10), alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.white, fontSize: moderateScale(16) }}>Save</Text>
            </TouchableOpacity>
        )
    }

    const onBookNow = async () => {
        if (!selectedEvent.date || !selectedEvent.startTime || !selectedEvent.endTime || !selectedEvent.description || !selectedEvent.image || !selectedEvent.fullName || !selectedEvent.dob || !selectedEvent.tob || !selectedEvent.place || !selectedEvent.kundali) {
            showErrorMessage('Please fill all the details.')
            return
        }
        if (selectedEvent.startTime >= selectedEvent.endTime) {
            showErrorMessage('Start time should be less than end time.')
            return
        }

        const data = {
            astrologerId: selectedEvent?.astrologerId,
            astrologerName: selectedEvent?.astrologerName,
            rate: selectedEvent?.rate,
            date: selectedEvent.date,
            startTime: selectedEvent.startTime,
            endTime: selectedEvent.endTime,
            description: selectedEvent.description,
            notificationType: selectedEvent.notificationType,
            image: selectedEvent.image,
            fullName: selectedEvent.fullName,
            dob: selectedEvent.dob,
            tob: selectedEvent.tob,
            place: selectedEvent.place,
            kundali: selectedEvent.kundali
        }
        console.log('Book Now', data)
        disptach(setLoading(true))
        const res = await createBooking(data)
        if (res) {
            disptach(setLoading(false))
            showSuccessMessage('Your booking request successfully created.')
            onClose()
        }
    }

    const onSelectNotification = () => {
        setNotificationModal(true)
    }

    const onNotificaitonModalClose = () => {
        setNotificationModal(false)
    }

    const onNotificationSelect = (notificationType: string) => {
        disptach(onChangeEventData({ notificationType }))
        setNotificationModal(false)
    }

    const renderNotificationModal = () => {
        return <RNModal visible={notificationModal} onClose={onNotificaitonModalClose} >
            <TouchableWithoutFeedback>
                <View style={{ backgroundColor: Colors.white, borderTopLeftRadius: horizontalScale(7), borderTopRightRadius: horizontalScale(7), padding: horizontalScale(25) }}>
                    <RadioOpion label='No notification' onSelect={() => onNotificationSelect('1')} isSelected={selectedEvent.notificationType == '1'} />
                    <RadioOpion label='5 minutes before' onSelect={() => onNotificationSelect('2')} isSelected={selectedEvent.notificationType == '2'} />
                    <RadioOpion label='10 minutes before' onSelect={() => onNotificationSelect('3')} isSelected={selectedEvent.notificationType == '3'} />
                    <RadioOpion label='15 minutes before' onSelect={() => onNotificationSelect('4')} isSelected={selectedEvent.notificationType == '4'} />
                    <RadioOpion label='1 hour before' onSelect={() => onNotificationSelect('5')} isSelected={selectedEvent.notificationType == '5'} />
                    <RadioOpion label='1 day before' onSelect={() => onNotificationSelect('6')} isSelected={selectedEvent.notificationType == '6'} />
                </View>
            </TouchableWithoutFeedback>
        </RNModal>
    }

    const onUploadPhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            disptach(onChangeEventData({ image: result.assets[0].uri }))
        }
    }

    const onUploadKundali = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            disptach(onChangeEventData({ kundali: result.assets[0].uri }))
        }
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
        switch (selectedEvent.notificationType) {
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

    const getColor = () => {
        switch (selectedEvent.status) {
            case 'approved':
                return Colors.blue;
            case 'waiting':
                return Colors.yellow;
            case 'rejected':
                return Colors.orange;
            case 'deleted':
                return Colors.red;
            default:
                return Colors.green;
        }
    }

    const getIcon = () => {
        switch (selectedEvent.status) {
            case 'approved':
                return Images.check;
            case 'waiting':
                return Images.clock;
            case 'rejected':
                return Images.close;
            case 'deleted':
                return Images.delete;
            default:
                return Images.double_check;
        }
    }

    const statusLabel = () => {
        switch (selectedEvent.status) {
            case 'approved':
                return 'Approved'
            case 'waiting':
                return 'Pending Approval'
            case 'rejected':
                return 'Rejected'
            case 'deleted':
                return 'Deleted'
            default:
                return 'Completed'
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <Header title={selectedEvent.id ? 'View Event' : 'Add Event'} onClose={onClose} right={renderRight()} />
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: horizontalScale(20) }} keyboardShouldPersistTaps='handled'>
                    <View style={[styles.fieldContainer, { marginTop: horizontalScale(10), padding: horizontalScale(15) }]}>
                        <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(12) }}>Astrologer Name</Text>
                        <Text style={{ fontFamily: Fonts.PoppinsBold, color: Colors.black1, fontSize: moderateScale(16) }}>{selectedEvent.astrologerName}</Text>
                    </View>
                    <View style={[styles.fieldContainer, { padding: horizontalScale(10) }]}>
                        <View style={{ flexDirection: 'row' }}>
                            <SvgImage url={Images.all_details} style={{ ...styles.fieldIcon, marginTop: horizontalScale(5) }} />
                            <TextInput
                                editable={editable}
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
                            <DateTimePicker editable={!editable} label='Select Date' value={selectedEvent.date} onSelect={onSelectDate} minDate={new Date()} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.time} style={styles.fieldIcon} />
                            <DateTimePicker editable={!editable} label='Start Time' mode={'time'} value={selectedEvent.startTime} onSelect={onSelectStartTime} />
                            <View style={{ borderLeftWidth: 1, borderLeftColor: Colors.grey, height: horizontalScale(55) }} />
                            <DateTimePicker editable={!editable} label='End Time' mode={'time'} value={selectedEvent.endTime} onSelect={onSelectEndTime} style={{ alignItems: 'center' }} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.bell} style={styles.fieldIcon} />
                            <TouchableOpacity disabled={!editable} onPress={onSelectNotification} style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined }]}>{notificationLabel()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {selectedEvent.status ? <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={getIcon()} style={{ ...styles.fieldIcon, tintColor: getColor() }} />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={[styles.input, { height: undefined, color: getColor() }]}>{statusLabel()}</Text>
                            </View>
                        </View>
                    </View> : null}
                    <View style={{ ...styles.fieldContainer, height: horizontalScale(50), backgroundColor: Colors.white3, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: Fonts.PoppinsBold, color: Colors.black1, fontSize: moderateScale(12) }} >Personal Details</Text>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(70), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.photo} style={styles.fieldIcon} />
                            {selectedEvent.image ? <SvgImage url={selectedEvent.image} style={{ height: horizontalScale(65), width: horizontalScale(65), marginRight: horizontalScale(10) }} /> : null}
                            <TouchableOpacity disabled={!editable} onPress={onUploadPhoto} style={{ justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.orange, fontSize: moderateScale(12) }}>Upload your photo</Text>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(9) }}>Only JPEG or PNG</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.user} style={styles.fieldIcon} />
                            <TextInput
                                editable={editable}
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
                            <DateTimePicker editable={!editable} label='Date of Birth' value={selectedEvent.dob} onSelect={onSelectDateOfBirth} maxDate={new Date()} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.time} style={styles.fieldIcon} />
                            <DateTimePicker editable={!editable} label='Time of Birth' mode={'time'} value={selectedEvent.tob} onSelect={onSelectTimeOfBirth} />
                        </View>
                    </View>
                    <View style={[styles.fieldContainer, { height: horizontalScale(55), justifyContent: 'center' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <SvgImage url={Images.place} style={styles.fieldIcon} />
                            <TextInput
                                editable={editable}
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
                            {selectedEvent.kundali ? <SvgImage url={selectedEvent.kundali} style={{ height: horizontalScale(65), width: horizontalScale(65), marginRight: horizontalScale(10) }} /> : null}
                            <TouchableOpacity disabled={!editable} onPress={onUploadKundali} style={{ justifyContent: 'center' }}>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.orange, fontSize: moderateScale(12) }}>Upload your kundali</Text>
                                <Text style={{ fontFamily: Fonts.PoppinsRegular, color: Colors.grey, fontSize: moderateScale(9) }}>Only JPEG or PNG</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {selectedEvent.id ? null : <View style={{ paddingHorizontal: horizontalScale(20), marginTop: horizontalScale(20) }}>
                        <Button title='Book Now' onPress={onBookNow} />
                    </View>}
                </ScrollView>
                {renderNotificationModal()}
            </View>
        </KeyboardAvoidingView>
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

export default Event