import { horizontalScale, moderateScale } from '@/utils/matrix';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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
import { onChangeEventData } from '@/redux/eventSlice';
import moment from 'moment';
import {
  astrologerProfileImageSelector,
  selectedEventSelector,
  userSelector,
} from '@/redux/selector';
import { setLoading } from '@/redux/loadingSlice';
import {
  checkDateAndTimeSlot,
  createBooking,
  deductWalletBalance,
  deleteBooking,
  updateBooking,
} from '@/services/db';
import {
  calculateMinutes,
  getDefaultHeaderHeight,
  showErrorMessage,
  showSuccessMessage,
} from '@/utils/helper';
import RazorpayCheckout from 'react-native-razorpay';

const Header = ({
  title,
  right,
  onClose,
}: {
  title: string;
  right?: ReactElement | null;
  onClose: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const statusBarHeight = insets.top;
  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  return (
    <View style={{ height: defaultHeight + 10 }}>
      <View pointerEvents="none" style={{ height: statusBarHeight }} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={onClose}
          style={{ width: '10%', justifyContent: 'center' }}>
          <SvgImage
            url={Images.close}
            style={{ height: horizontalScale(16), width: horizontalScale(16) }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {right ? right : <View style={{ width: '10%' }} />}
      </View>
    </View>
  );
};

const Event = () => {
  const [notificationModal, setNotificationModal] = useState(false);
  const [paymentModeModal, setPaymentModeModal] = useState(false);
  const [editable, setEditable] = useState(true);
  const dispatch = useDispatch();
  const selectedEvent = selectedEventSelector();
  const router = useRouter();
  const userdata = userSelector();

  const astrologerProfileImage = astrologerProfileImageSelector(
    selectedEvent.astrologerid
  );

  console.log('Selected event', selectedEvent);

  useEffect(() => {
    if (selectedEvent.bookingid) {
      setEditable(false);
    }
  }, []);

  const checkSlotAvailable = async () => {
    if (selectedEvent.date && selectedEvent.starttime && selectedEvent.endtime)
      await checkDateAndTimeSlot(selectedEvent);
  };

  useEffect(() => {
    checkSlotAvailable();
  }, [selectedEvent.date, selectedEvent.starttime, selectedEvent.endtime]);

  const amount = useMemo(() => {
    if (!selectedEvent.starttime || !selectedEvent.endtime) return 0;
    return Number(
      calculateMinutes(selectedEvent.starttime, selectedEvent.endtime) *
        selectedEvent.astrologercharge
    );
  }, [selectedEvent.starttime, selectedEvent.endtime]);

  const onClose = () => {
    router.back();
  };

  const onEditPress = () => {
    setEditable(true);
  };

  const onDelete = async () => {
    dispatch(setLoading(true));
    const res = await deleteBooking(selectedEvent.bookingid);
    if (res) {
      dispatch(setLoading(false));
      showSuccessMessage('Your booking request deleted successfully.');
      onClose();
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this booking request?',
      [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          onPress: onDelete,
        },
      ]
    );
  };

  const renderRight = () => {
    if (
      selectedEvent.bookingid &&
      (selectedEvent.status == 'completed' ||
        selectedEvent.status == 'rejected' ||
        selectedEvent.status == 'deleted')
    )
      return null;

    if (selectedEvent.bookingid) {
      if (editable) {
        return (
          <TouchableOpacity
            onPress={() => onBookNow(true)}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            style={{
              paddingHorizontal: horizontalScale(10),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: Fonts.PoppinsRegular,
                color: Colors.white,
                fontSize: moderateScale(16),
              }}>
              Update
            </Text>
          </TouchableOpacity>
        );
      }
      return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={onEditPress}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            style={{
              paddingHorizontal: horizontalScale(10),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgImage
              url={Images.edit}
              style={{
                height: horizontalScale(16),
                width: horizontalScale(16),
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onDeletePress}
            hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
            style={{
              paddingHorizontal: horizontalScale(10),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <SvgImage
              url={Images.delete}
              style={{
                height: horizontalScale(16),
                width: horizontalScale(16),
              }}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={() => onBookNow(false)}
        hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
        style={{
          paddingHorizontal: horizontalScale(10),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontFamily: Fonts.PoppinsRegular,
            color: Colors.white,
            fontSize: moderateScale(16),
          }}>
          Save
        </Text>
      </TouchableOpacity>
    );
  };

  const handlePayment = async (amount: number) => {
    var options: any = {
      description: 'Asrtology Service',
      image:
        'https://firebasestorage.googleapis.com/v0/b/sales-astrology-reactnative.appspot.com/o/images%2Fastro_logo.png?alt=media&token=da65b3f5-0bba-463c-b891-1cfd7381eab9',
      currency: 'INR',
      key: process.env.EXPO_PUBLIC_RZP_API_KEY_TEST, // Your api key
      amount: amount * 100,
      name: 'AstroYodha',
      prefill: {
        email: userdata.email || '',
        contact: userdata.phone || '',
        name: userdata.fullname || '',
      },
      theme: { color: Colors.orange },
    };
    return RazorpayCheckout.open(options);
  };

  const onBookNow = async (isUpdate = false) => {
    if (
      !selectedEvent.date ||
      !selectedEvent.starttime ||
      !selectedEvent.endtime ||
      !selectedEvent.description ||
      !selectedEvent.photo ||
      !selectedEvent.fullname ||
      !selectedEvent.birthdate ||
      !selectedEvent.birthtime ||
      !selectedEvent.birthplace ||
      !selectedEvent.kundali
    ) {
      showErrorMessage('Please fill all the details.');
      return;
    }
    if (selectedEvent.starttime >= selectedEvent.endtime) {
      showErrorMessage('Start time should be less than end time.');
      return;
    }
    if (!selectedEvent.slotAvailable) {
      showErrorMessage('Astrologer is not available at this time.');
      return;
    }
    if (!selectedEvent.paymenttype && amount > 0) {
      showErrorMessage('Please select payment mode.');
      return;
    }
    const data: {
      id?: string;
      astrologerid: any;
      astrologername: any;
      amount: any;
      astrologercharge: any;
      date: any;
      starttime: any;
      endtime: any;
      description: any;
      notificationmin: any;
      notify: any;
      photo: any;
      fullname: any;
      birthdate: any;
      birthtime: any;
      birthplace: any;
      kundali: any;
      userbirthdate: any;
      username: any;
      userprofileimage: any;
      paymentstatus?: any;
      paymenttype?: any;
      transactionid?: any;
    } = {
      astrologerid: selectedEvent?.astrologerid,
      astrologername: selectedEvent?.astrologername,
      amount,
      astrologercharge: selectedEvent?.astrologercharge,
      date: selectedEvent.date,
      starttime: selectedEvent.starttime,
      endtime: selectedEvent.endtime,
      description: selectedEvent.description,
      notificationmin: selectedEvent.notificationmin,
      notify: selectedEvent.notify,
      photo: selectedEvent.photo,
      fullname: selectedEvent.fullname,
      birthdate: selectedEvent.birthdate,
      birthtime: selectedEvent.birthtime,
      birthplace: selectedEvent.birthplace,
      kundali: selectedEvent.kundali,
      userbirthdate: userdata.birthdate,
      username: userdata.fullname,
      userprofileimage: userdata.profileimage,
      transactionid: '',
      paymentstatus: '',
    };
    console.log('data', data);
    if (isUpdate) {
      data.id = selectedEvent.bookingid;
      const res = await updateBooking(data);
      if (res) {
        showSuccessMessage('Your booking request updated successfully.');
        onClose();
      }
    } else {
      try {
        if (amount > 0) {
          data.paymenttype = selectedEvent.paymenttype;
          if (selectedEvent.paymenttype != 'wallet') {
            const paymentRes = await handlePayment(amount);
            console.log('res', paymentRes);
            data.transactionid = paymentRes.razorpay_payment_id;
            data.paymentstatus = 'captured';
          } else {
            await deductWalletBalance(data.amount);
          }
        }
        const res = await createBooking(data);
        if (res) {
          showSuccessMessage('Your booking request successfully created.');
          onClose();
        }
      } catch (error) {
        console.log('Payment Error', error);
        showErrorMessage('Payment unsuccessful. Please try again.');
      }
    }
  };

  const onSelectNotification = () => {
    setNotificationModal(true);
  };

  const onNotificaitonModalClose = () => {
    setNotificationModal(false);
  };

  const onNotificationSelect = (notify: string, notificationmin: string) => {
    dispatch(onChangeEventData({ notify, notificationmin }));
    setNotificationModal(false);
  };

  const renderNotificationModal = () => {
    return (
      <RNModal visible={notificationModal} onClose={onNotificaitonModalClose}>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: horizontalScale(7),
              borderTopRightRadius: horizontalScale(7),
              padding: horizontalScale(25),
            }}>
            <RadioOpion
              label="No notification"
              onSelect={() => onNotificationSelect('No notification', '0')}
              isSelected={selectedEvent.notificationmin == '0'}
            />
            <RadioOpion
              label="5 minutes before"
              onSelect={() => onNotificationSelect('5 minutes before', '5')}
              isSelected={selectedEvent.notificationmin == '5'}
            />
            <RadioOpion
              label="10 minutes before"
              onSelect={() => onNotificationSelect('10 minutes before', '10')}
              isSelected={selectedEvent.notificationmin == '10'}
            />
            <RadioOpion
              label="15 minutes before"
              onSelect={() => onNotificationSelect('15 minutes before', '15')}
              isSelected={selectedEvent.notificationmin == '15'}
            />
            <RadioOpion
              label="1 hour before"
              onSelect={() => onNotificationSelect('1 hour before', '60')}
              isSelected={selectedEvent.notificationmin == '60'}
            />
            <RadioOpion
              label="1 day before"
              onSelect={() => onNotificationSelect('1 day before', '1440')}
              isSelected={selectedEvent.notificationmin == '1440'}
            />
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    );
  };

  const onPaymentModeSelect = () => {
    setPaymentModeModal(true);
  };

  const onPaymentModeClose = () => {
    setPaymentModeModal(false);
  };

  const onSelectPaymentMode = (paymenttype: string) => {
    if (paymenttype == 'wallet' && amount > userdata.walletbalance) {
      setPaymentModeModal(false);
      showErrorMessage('Insufficient wallet balance.');
      return;
    }
    dispatch(onChangeEventData({ paymenttype }));
    setPaymentModeModal(false);
  };

  const renderPaymentModeModal = () => {
    return (
      <RNModal visible={paymentModeModal} onClose={onPaymentModeClose}>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: horizontalScale(7),
              borderTopRightRadius: horizontalScale(7),
              padding: horizontalScale(25),
            }}>
            <RadioOpion
              label="Pay with wallet"
              onSelect={() => onSelectPaymentMode('wallet')}
              isSelected={selectedEvent.paymenttype == 'wallet'}
            />
            <RadioOpion
              label="Pay with online"
              onSelect={() => onSelectPaymentMode('paymentgateway')}
              isSelected={selectedEvent.paymenttype == 'paymentgateway'}
            />
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    );
  };

  const onUploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      dispatch(onChangeEventData({ photo: result.assets[0].uri }));
    }
  };

  const onUploadKundali = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      dispatch(onChangeEventData({ kundali: result.assets[0].uri }));
    }
  };

  const onChangeDetails = (text: string) => {
    dispatch(onChangeEventData({ description: text }));
  };

  const onSelectDate = (date: Date) => {
    dispatch(onChangeEventData({ date: moment(date).format('DD MMM YYYY') }));
  };

  const onSelectStartTime = (date: Date) => {
    dispatch(onChangeEventData({ starttime: moment(date).format('hh:mm A') }));
  };

  const onSelectEndTime = (date: Date) => {
    dispatch(onChangeEventData({ endtime: moment(date).format('hh:mm A') }));
  };

  const onChangeFullName = (text: string) => {
    dispatch(onChangeEventData({ fullname: text }));
  };

  const onSelectDateOfBirth = (date: Date) => {
    dispatch(
      onChangeEventData({ birthdate: moment(date).format('DD MMM YYYY') })
    );
  };

  const onSelectTimeOfBirth = (date: Date) => {
    dispatch(onChangeEventData({ birthtime: moment(date).format('hh:mm A') }));
  };

  const onChangePlaceOfBirth = (text: string) => {
    dispatch(onChangeEventData({ birthplace: text }));
  };

  const onCallPress = () => {};

  const onChatPress = () => {
    router.navigate({
      pathname: '/(home)/chat',
      params: {
        username: selectedEvent?.astrologername,
        profileimage: encodeURIComponent(astrologerProfileImage),
        receiverid: selectedEvent.astrologerid,
        boookingid: selectedEvent?.bookingid,
        status: selectedEvent?.status,
      },
    });
  };

  const getColor = () => {
    switch (selectedEvent.status) {
      case 'approved':
        return Colors.blue;
      case 'waiting':
        return Colors.yellow;
      case 'rejected':
        return Colors.orange;
      case 'deleted':
        return Colors.red1;
      default:
        return Colors.green;
    }
  };

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
  };

  const statusLabel = () => {
    switch (selectedEvent.status) {
      case 'approved':
        return 'Approved';
      case 'waiting':
        return 'Pending Approval';
      case 'rejected':
        return 'Rejected';
      case 'deleted':
        return 'Deleted';
      default:
        return 'Completed';
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Header
        title={selectedEvent.bookingid ? 'View Event' : 'Add Event'}
        onClose={onClose}
        right={renderRight()}
      />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: horizontalScale(20) }}
          keyboardShouldPersistTaps="handled">
          <View
            style={[
              styles.fieldContainer,
              { marginTop: horizontalScale(10), padding: horizontalScale(15) },
            ]}>
            <Text
              style={{
                fontFamily: Fonts.PoppinsRegular,
                color: Colors.grey,
                fontSize: moderateScale(12),
              }}>
              Astrologer Name
            </Text>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                color: Colors.black1,
                fontSize: moderateScale(16),
              }}>
              {selectedEvent.astrologername}
            </Text>
          </View>
          <View
            style={[styles.fieldContainer, { padding: horizontalScale(10) }]}>
            <View style={{ flexDirection: 'row' }}>
              <SvgImage
                url={Images.all_details}
                style={{ ...styles.fieldIcon, marginTop: horizontalScale(5) }}
              />
              <TextInput
                editable={editable}
                numberOfLines={3}
                multiline
                placeholder="All details"
                placeholderTextColor={Colors.grey}
                onChangeText={onChangeDetails}
                textAlignVertical="top"
                value={selectedEvent.description}
                style={[styles.input, { height: horizontalScale(55) }]}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.calendar} style={styles.fieldIcon} />
              <DateTimePicker
                editable={!editable}
                label="Select Date"
                value={selectedEvent.date}
                onSelect={onSelectDate}
                minDate={new Date()}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.time} style={styles.fieldIcon} />
              <DateTimePicker
                editable={!editable}
                label="Start Time"
                mode={'time'}
                value={selectedEvent.starttime}
                onSelect={onSelectStartTime}
              />
              <View
                style={{
                  borderLeftWidth: 1,
                  borderLeftColor: Colors.grey,
                  height: horizontalScale(55),
                }}
              />
              <DateTimePicker
                editable={!editable}
                label="End Time"
                mode={'time'}
                value={selectedEvent.endtime}
                onSelect={onSelectEndTime}
                style={{ alignItems: 'center' }}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.bell} style={styles.fieldIcon} />
              <TouchableOpacity
                disabled={!editable}
                onPress={onSelectNotification}
                style={{ justifyContent: 'center' }}>
                <Text style={[styles.input, { height: undefined }]}>
                  {selectedEvent.notify}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {selectedEvent.status ? (
            <View
              style={[
                styles.fieldContainer,
                { height: horizontalScale(55), justifyContent: 'center' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgImage
                  url={getIcon()}
                  style={{ ...styles.fieldIcon, tintColor: getColor() }}
                />
                <View style={{ justifyContent: 'center' }}>
                  <Text
                    style={[
                      styles.input,
                      { height: undefined, color: getColor() },
                    ]}>
                    {statusLabel()}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Personal Details</Text>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(70), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.photo} style={styles.fieldIcon} />
              {selectedEvent.photo ? (
                <SvgImage
                  url={selectedEvent.photo}
                  style={{
                    height: horizontalScale(65),
                    width: horizontalScale(65),
                    marginRight: horizontalScale(10),
                  }}
                />
              ) : null}
              <TouchableOpacity
                disabled={!editable}
                onPress={onUploadPhoto}
                style={{ justifyContent: 'center' }}>
                <Text style={styles.colorLabel}>Upload your photo</Text>
                <Text style={styles.smallLabel}>Only JPEG or PNG</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.user} style={styles.fieldIcon} />
              <TextInput
                editable={editable}
                placeholder="Full Name"
                placeholderTextColor={Colors.grey}
                onChangeText={onChangeFullName}
                style={styles.input}
                value={selectedEvent.fullname}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.calendar} style={styles.fieldIcon} />
              <DateTimePicker
                editable={!editable}
                label="Date of Birth"
                value={selectedEvent.birthdate}
                onSelect={onSelectDateOfBirth}
                maxDate={new Date()}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.time} style={styles.fieldIcon} />
              <DateTimePicker
                editable={!editable}
                label="Time of Birth"
                mode={'time'}
                value={selectedEvent.birthtime}
                onSelect={onSelectTimeOfBirth}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.place} style={styles.fieldIcon} />
              <TextInput
                editable={editable}
                placeholder="Place of Birth"
                placeholderTextColor={Colors.grey}
                onChangeText={onChangePlaceOfBirth}
                value={selectedEvent.birthplace}
                style={styles.input}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(70), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.kundali} style={styles.fieldIcon} />
              {selectedEvent.kundali ? (
                <SvgImage
                  url={selectedEvent.kundali}
                  style={{
                    height: horizontalScale(65),
                    width: horizontalScale(65),
                    marginRight: horizontalScale(10),
                  }}
                />
              ) : null}
              <TouchableOpacity
                disabled={!editable}
                onPress={onUploadKundali}
                style={{ justifyContent: 'center' }}>
                <Text style={styles.colorLabel}>Upload your kundali</Text>
                <Text style={styles.smallLabel}>Only JPEG or PNG</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Payment Mode</Text>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.wallet} style={styles.fieldIcon} />
              <TouchableOpacity
                disabled={!editable}
                onPress={onPaymentModeSelect}
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  flex: 1,
                }}>
                {selectedEvent.paymenttype ? (
                  <Text style={[styles.input, { height: undefined }]}>
                    {selectedEvent.paymenttype == 'wallet'
                      ? 'Pay with wallet'
                      : 'Pay with online'}
                  </Text>
                ) : (
                  <Text style={[styles.input, { height: undefined }]}>
                    Select Payment Mode
                  </Text>
                )}
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <SvgImage
                    url={Images.rupee}
                    style={{
                      height: horizontalScale(8),
                      width: horizontalScale(8),
                      tintColor: Colors.orange,
                    }}
                  />
                  <Text style={styles.colorLabel}>{amount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {selectedEvent.bookingid ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: horizontalScale(20),
              }}>
              <Button
                title="Call"
                onPress={onCallPress}
                style={{ width: '40%' }}
              />
              <Button
                title="Chat"
                onPress={onChatPress}
                style={{ width: '40%' }}
              />
            </View>
          ) : (
            <View
              style={{
                paddingHorizontal: horizontalScale(20),
                marginTop: horizontalScale(20),
              }}>
              <Button title="Book Now" onPress={() => onBookNow(false)} />
            </View>
          )}
        </ScrollView>
        {renderNotificationModal()}
        {renderPaymentModeModal()}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    backgroundColor: Colors.orange,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.white,
    fontFamily: Fonts.PoppinsRegular,
  },
  fieldContainer: {
    paddingHorizontal: horizontalScale(20),
    padding: horizontalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.white1,
  },
  fieldIcon: {
    height: horizontalScale(16),
    width: horizontalScale(16),
    marginRight: horizontalScale(10),
    tintColor: Colors.grey,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
    fontSize: moderateScale(12),
    height: horizontalScale(45),
  },
  section: {
    paddingHorizontal: horizontalScale(20),
    padding: horizontalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.white1,
    height: horizontalScale(50),
    backgroundColor: Colors.white3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontFamily: Fonts.PoppinsBold,
    color: Colors.black1,
    fontSize: moderateScale(12),
  },
  colorLabel: {
    color: Colors.orange,
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
  },
  smallLabel: {
    color: Colors.grey,
    fontSize: moderateScale(9),
    fontFamily: Fonts.PoppinsRegular,
  },
});

export default Event;
