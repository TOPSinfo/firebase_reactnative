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
  Platform,
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
import Button from './Button';

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

  /**
   * Handles the close event by navigating back to the previous page.
   * This function is typically used to close a modal or a popup.
   */
  const onClose = () => {
    router.back();
  };

  /**
   * Handles the press event for editing.
   * Sets the editable state to true.
   */
  const onEditPress = () => {
    setEditable(true);
  };

  const renderRight = () => {
    if (selectedEvent.status != 'waiting') return null;
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

  /**
   * Handles the update of the selected event status.
   *
   * This function performs the following steps:
   * 1. Checks if the selected event status is 'waiting'. If so, it shows an error message and returns early.
   * 2. Dispatches an action to set the loading state to true.
   * 3. Calls the `updateEventStatus` function to update the status of the selected event.
   * 4. If the status update is successful, it fetches the updated bookings, sets the loading state to false,
   *    shows a success message, and closes the modal.
   *
   * @async
   * @function onUpdate
   * @returns {Promise<void>} A promise that resolves when the update process is complete.
   */
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

  /**
   * Handles the selection of a pending status.
   * This function sets the modal state to true, indicating that the modal should be displayed.
   */
  const onSelectPendingStatus = () => {
    setModal(true);
  };

  /**
   * Handles the closing of the accept/reject modal by setting the modal state to false.
   */
  const onAcceptRejectModalClose = () => {
    setModal(false);
  };

  /**
   * Handles the selection of a status and updates the event data accordingly.
   *
   * @param {string} status - The selected status to be set for the event.
   * @returns {void}
   */
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

  /**
   * Handles the change event for the details input field.
   *
   * @param text - The new text value for the description.
   */
  const onChangeDetails = (text: string) => {
    dispatch(onChangeEventData({ description: text }));
  };

  /**
   * Handles the selection of a date and dispatches an action to update the event data with the selected date.
   *
   * @param {Date} date - The selected date.
   */
  const onSelectDate = (date: Date) => {
    dispatch(onChangeEventData({ date: moment(date).format('DD MMM YYYY') }));
  };

  /**
   * Handles the selection of the start time for an event.
   *
   * @param date - The selected date and time.
   */
  const onSelectStartTime = (date: Date) => {
    dispatch(onChangeEventData({ startTime: moment(date).format('hh:mm A') }));
  };

  /**
   * Handles the selection of the end time for an event.
   *
   * @param date - The selected end time as a Date object.
   */
  const onSelectEndTime = (date: Date) => {
    dispatch(onChangeEventData({ endTime: moment(date).format('hh:mm A') }));
  };

  /**
   * Navigates to the chat page with the selected event's details as query parameters.
   *
   * @function
   * @name onJoinCallorChat
   * @returns {void}
   *
   * @description
   * This function uses the Next.js router to navigate to the '/chat' page. It passes the following parameters:
   * - `username`: The username of the selected event.
   * - `profileimage`: The URL-encoded profile image of the selected event's user.
   * - `receiverid`: The unique ID of the selected event's user.
   * - `boookingid`: The booking ID of the selected event (optional).
   * - `status`: The status of the selected event (optional).
   */
  const onJoinCallorChat = () => {
    router.push({
      pathname: '/chat',
      params: {
        username: selectedEvent.username,
        profileimage: encodeURIComponent(selectedEvent.userprofileimage),
        receiverid: selectedEvent.uid,
        boookingid: selectedEvent?.bookingid,
        status: selectedEvent?.status,
      },
    });
  };

  /**
   * Returns the color corresponding to the status of the selected event.
   *
   * @returns {string} The color associated with the event status.
   *
   * The possible statuses and their corresponding colors are:
   * - 'approved': Colors.blue
   * - 'waiting': Colors.yellow
   * - 'rejected': Colors.orange
   * - 'deleted': Colors.red1
   * - default: Colors.green
   */
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

  /**
   * Returns the icon corresponding to the status of the selected event.
   *
   * @returns {string} The icon associated with the event status.
   *
   * The possible statuses and their corresponding icons are:
   * - 'approved': Images.check
   * - 'waiting': Images.clock
   * - 'rejected': Images.close
   * - 'deleted': Images.delete
   * - default: Images.double_check
   */
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

  /**
   * Returns the label corresponding to the status of the selected event.
   *
   * @returns {string} The label associated with the event status.
   *
   * The possible statuses and their corresponding labels are:
   * - 'approved': 'Approved'
   * - 'waiting': 'Pending Approval'
   * - 'rejected': 'Rejected'
   * - 'deleted': 'Deleted'
   * - default: 'Completed'
   */
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
    <KeyboardAvoidingView
      enabled={Platform.OS == 'ios'}
      style={styles.container}
      behavior="padding">
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
              {selectedEvent.fullname}
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
                  value={selectedEvent.starttime}
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
                  value={selectedEvent.endtime}
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
              <SvgImage url={Images.bell} style={styles.fieldIcon} />
              <View style={{ justifyContent: 'center' }}>
                <Text
                  style={{
                    fontFamily: Fonts.PoppinsRegular,
                    color: Colors.black1,
                    fontSize: moderateScale(12),
                  }}>
                  {selectedEvent.notify}
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
                    style={{
                      fontFamily: Fonts.PoppinsRegular,
                      fontSize: moderateScale(12),
                      color: getColor(),
                    }}>
                    {statusLabel()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
        <View style={{ padding: horizontalScale(20) }}>
          <Button title="Join call or chat" onPress={onJoinCallorChat} />
        </View>
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
