import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { router } from 'expo-router';
import {
  selectedEventSelector,
  userSelector,
  userTypeSelector,
} from '@/redux/selector';
import {
  createCallLog,
  extendCallLog,
  findActiveCallLog,
  updateCallLog,
} from '@/services/db';
import {
  calculateMinutes,
  cancelSchedulePushNotification,
  schedulePushNotification,
  showErrorMessage,
} from '@/utils/helper';
import RazorpayCheckout from 'react-native-razorpay';
import { Colors } from '@/constants/Colors';

const videocall = () => {
  const [callId, setCallId] = useState<string | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const jitsiMeeting = useRef(null);
  const selectedEvent = selectedEventSelector();
  const userdata = userSelector();
  const userType = userTypeSelector();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log('Selected Event', selectedEvent);

  const endCall = async () => {
    if (callId) {
      await updateCallLog(callId, selectedEvent.bookingid);
    }
  };

  useEffect(() => {
    return () => {
      endCall();
    };
  }, [callId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        console.log('Clear Timeout');
        // cancelSchedulePushNotification(notificationId);
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  const processPayment = async (docId: string) => {
    try {
      const amount = selectedEvent.astrologercharge * 15;
      const paymentRes = await handlePayment(amount);
      const data = {
        ...selectedEvent,
        amount: Number(amount),
        transactionid: paymentRes.razorpay_payment_id,
        paymenttype: 'paymentgateway',
        username: userdata.fullname,
      };
      await extendCallLog(docId, selectedEvent.bookingid, data);
      registerTimer(docId, 15);
    } catch (error) {
      console.log('Payment Error', error);
      showErrorMessage('Payment unsuccessful. Please try again.');
    }
  };

  const onReadyToClose = useCallback(() => {
    console.log('Ready to close', userType);
    jitsiMeeting.current?.close();
    router.back();
  }, []);

  const onEndpointMessageReceived = useCallback(() => {
    console.log('You got a message!');
  }, []);

  const registerEndTimer = () => {
    if (userType == 'user') {
      setTimeout(() => {
        jitsiMeeting.current?.close();
        router.back();
      }, 600 * 1000);
    }
  };

  const registerTimer = (docId: string, time?: number) => {
    if (userType == 'user') {
      const totalTime = calculateMinutes(
        selectedEvent.starttime,
        selectedEvent.endtime
      );
      const reminderTime = time ? time * 60 : (totalTime - 10) * 60;
      console.log('Total Time', reminderTime);
      timeoutRef.current = setTimeout(() => {
        Alert.alert(
          'Meeting Reminder',
          'Your meeting is about to end in 10 minutes, Do you want to extend?',
          [
            {
              text: 'Extend',
              onPress: () => {
                clearTimeout(timeoutRef.current!);
                processPayment(docId);
              },
            },
            {
              text: 'Close',
              onPress: () => {
                clearTimeout(timeoutRef.current!);
                registerEndTimer();
              },
            },
          ]
        );
      }, reminderTime * 1000);
      // const id = await schedulePushNotification(reminderTime);
      // console.log('notification', id);
      // setNotificationId(id);
    }
  };

  const onConferenceJoined = useCallback(async () => {
    const resActive = await findActiveCallLog(selectedEvent.bookingid);
    if (resActive) {
      console.log('Active Call Log Found', resActive);
      setCallId(resActive);
      registerTimer(resActive);
      return;
    }
    const data = {
      uid: userdata.uid,
      username: userdata.fullname,
      usertype: userType,
    };
    const res = await createCallLog(data, selectedEvent.bookingid);
    if (res) {
      setCallId(res);
      registerTimer(res);
    }

    console.log('Conference Joined', userType);
  }, []);

  const onParticipantJoined = useCallback(() => {
    console.log('Participant Joined', userType);
  }, []);

  const onParticipantLeft = useCallback(() => {
    console.log('Conference Left---', userType);
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
    onConferenceJoined,
    onParticipantJoined,
    onParticipantLeft,
  };

  return (
    <JitsiMeeting
      config={{
        hideConferenceTimer: true,
      }}
      eventListeners={eventListeners as any}
      ref={jitsiMeeting}
      style={{ flex: 1 }}
      userInfo={{
        displayName: userdata.fullname,
        email: userdata.email,
        avatarURL: userdata.profileimage || '',
      }}
      flags={{
        'audioMute.enabled': true,
        'ios.screensharing.enabled': true,
        'fullscreen.enabled': false,
        'audioOnly.enabled': false,
        'android.screensharing.enabled': true,
        'pip.enabled': false,
        'pip-while-screen-sharing.enabled': false,
        'conference-timer.enabled': true,
        'close-captions.enabled': false,
        'toolbox.enabled': true,
        'meeting-name.enabled': false,
      }}
      room={'astro_appointment'}
      //serverURL={'https://meet.jit.si/'}
      serverURL="https://meet.ffmuc.net/"
      //serverURL="https://meet.guifi.net"
    />
  );
};

export default videocall;
