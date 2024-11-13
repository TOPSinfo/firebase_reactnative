import { horizontalScale, moderateScale } from '@/utils/matrix';
import React, { ReactElement, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
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
import RNModal from './RNModal';
import RadioOpion from './RadioOpion';
import DateTimePicker from './DateTimePicker';
import { useDispatch } from 'react-redux';
import { onChangeEventData, resetSelectedEvent } from '@/redux/eventSlice';
import moment from 'moment';
import { selectedEventSelector } from '@/redux/selector';
import { setLoading } from '@/redux/loadingSlice';
import { getMyBookings, updateEventStatus } from '@/services/db';
import {
  getDefaultHeaderHeight,
  showErrorMessage,
  showSuccessMessage,
} from '@/utils/helper';

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

const AstrologerEvent = () => {
  const [modal, setModal] = useState(false);
  const [editable, setEditable] = useState(true);
  const dispatch = useDispatch();
  const selectedEvent = selectedEventSelector();
  const router = useRouter();

  console.log('Selected event', selectedEvent);

  useEffect(() => {
    if (selectedEvent.id) {
      setEditable(false);
    }
    return () => {
      dispatch(resetSelectedEvent());
    };
  }, []);

  const onClose = () => {
    router.back();
  };

  const onEditPress = () => {
    setEditable(true);
  };

  const renderRight = () => {
    if (selectedEvent.id) {
      if (editable) {
        return (
          <TouchableOpacity
            onPress={onUpdate}
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
        </View>
      );
    }
  };

  const onUpdate = async () => {
    if (selectedEvent.status == 'waiting') {
      showErrorMessage('Please update pending approval status.');
      return;
    }
    dispatch(setLoading(true));

    const res = await updateEventStatus(selectedEvent.id, selectedEvent.status);
    if (res) {
      await getMyBookings();
      dispatch(setLoading(false));
      showSuccessMessage('Your booking request updated successfully.');
      onClose();
    }
  };

  const onSelectPendingStatus = () => {
    setModal(true);
  };

  const onAcceptRejectModalClose = () => {
    setModal(false);
  };

  const onStatusSelect = (status: string) => {
    dispatch(onChangeEventData({ status }));
    setModal(false);
  };

  const renderAcceptRejectModal = () => {
    return (
      <RNModal visible={modal} onClose={onAcceptRejectModalClose}>
        <TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: horizontalScale(7),
              borderTopRightRadius: horizontalScale(7),
              padding: horizontalScale(25),
            }}>
            <RadioOpion
              label="Accept"
              onSelect={() => onStatusSelect('approved')}
              isSelected={selectedEvent.status == 'approved'}
            />
            <RadioOpion
              label="Reject"
              onSelect={() => onStatusSelect('rejected')}
              isSelected={selectedEvent.status == 'rejected'}
            />
          </View>
        </TouchableWithoutFeedback>
      </RNModal>
    );
  };

  const onChangeDetails = (text: string) => {
    dispatch(onChangeEventData({ description: text }));
  };

  const onSelectDate = (date: Date) => {
    dispatch(onChangeEventData({ date: moment(date).format('DD MMM YYYY') }));
  };

  const onSelectStartTime = (date: Date) => {
    dispatch(onChangeEventData({ startTime: moment(date).format('hh:mm A') }));
  };

  const onSelectEndTime = (date: Date) => {
    dispatch(onChangeEventData({ endTime: moment(date).format('hh:mm A') }));
  };

  const notificationLabel = () => {
    switch (selectedEvent.notificationType) {
      case '1':
        return 'No notification';
      case '2':
        return '5 minutes before';
      case '3':
        return '10 minutes before';
      case '4':
        return '15 minutes before';
      case '5':
        return '1 hour before';
      case '6':
        return '1 day before';
      default:
        return '10 minutes before';
    }
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
      <Header title={'View Event'} onClose={onClose} right={renderRight()} />
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
              Name
            </Text>
            <Text
              style={{
                fontFamily: Fonts.PoppinsBold,
                color: Colors.black1,
                fontSize: moderateScale(16),
              }}>
              {selectedEvent.fullName}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <View style={{ flexDirection: 'row' }}>
              <SvgImage
                url={Images.all_details}
                style={{ ...styles.fieldIcon, marginTop: horizontalScale(5) }}
              />
              <TextInput
                editable={false}
                numberOfLines={3}
                multiline
                placeholder="All details"
                placeholderTextColor={Colors.grey}
                onChangeText={onChangeDetails}
                textAlignVertical="top"
                value={selectedEvent.description}
                style={[styles.input, { height: horizontalScale(58) }]}
              />
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(70), justifyContent: 'center' },
            ]}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                marginTop: horizontalScale(5),
              }}>
              <SvgImage url={Images.calendar} style={styles.fieldIcon} />
              <View>
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsRegular,
                    color: Colors.grey,
                    fontSize: moderateScale(12),
                    marginBottom: horizontalScale(5),
                    lineHeight: horizontalScale(15),
                  }}>
                  Date
                </Text>
                <DateTimePicker
                  editable={true}
                  label="Select Date"
                  value={selectedEvent.date}
                  onSelect={onSelectDate}
                  minDate={new Date()}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(70), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row' }}>
              <SvgImage
                url={Images.time}
                style={{ ...styles.fieldIcon, marginTop: horizontalScale(18) }}
              />
              <View style={{ flex: 1, marginTop: horizontalScale(18) }}>
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsRegular,
                    color: Colors.grey,
                    fontSize: moderateScale(12),
                    marginBottom: horizontalScale(5),
                    lineHeight: horizontalScale(15),
                  }}>
                  Start Time
                </Text>
                <DateTimePicker
                  editable={true}
                  label="Start Time"
                  mode={'time'}
                  value={selectedEvent.startTime}
                  onSelect={onSelectStartTime}
                />
              </View>
              <View
                style={{
                  borderLeftWidth: 1,
                  borderLeftColor: Colors.grey,
                  height: horizontalScale(70),
                }}
              />
              <View style={{ flex: 1, marginTop: horizontalScale(18) }}>
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsRegular,
                    color: Colors.grey,
                    fontSize: moderateScale(12),
                    marginBottom: horizontalScale(5),
                    lineHeight: horizontalScale(15),
                    textAlign: 'center',
                  }}>
                  End Time
                </Text>
                <DateTimePicker
                  editable={true}
                  label="End Time"
                  mode={'time'}
                  value={selectedEvent.endTime}
                  onSelect={onSelectEndTime}
                  style={{ alignItems: 'center' }}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.fieldContainer,
              { height: horizontalScale(55), justifyContent: 'center' },
            ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <SvgImage url={Images.bell} style={styles.fieldIcon} />
              <View style={{ justifyContent: 'center' }}>
                <Text style={[styles.input, { height: undefined }]}>
                  {notificationLabel()}
                </Text>
              </View>
            </View>
          </View>
          {selectedEvent.status ? (
            <TouchableOpacity
              disabled={!editable}
              onPress={onSelectPendingStatus}
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
            </TouchableOpacity>
          ) : null}
        </ScrollView>
        {renderAcceptRejectModal()}
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
    backgroundColor: Colors.blue,
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
});

export default AstrologerEvent;
