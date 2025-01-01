import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { router } from 'expo-router';
import {
  selectedEventSelector,
  userSelector,
  userTypeSelector,
} from '@/redux/selector';
import { createCallLog, findActiveCallLog, updateCallLog } from '@/services/db';
import {
  calculateMinutes,
  cancelSchedulePushNotification,
  schedulePushNotification,
} from '@/utils/helper';

const videocall = () => {
  const [callId, setCallId] = useState<string | null>(null);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const jitsiMeeting = useRef(null);
  const selectedEvent = selectedEventSelector();
  const userdata = userSelector();
  const userType = userTypeSelector();
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
      if (notificationId) {
        cancelSchedulePushNotification(notificationId);
      }
    };
  }, [notificationId]);

  const onReadyToClose = useCallback(() => {
    console.log('Ready to close', userType);
    jitsiMeeting.current?.close();
    router.back();
  }, []);

  const onEndpointMessageReceived = useCallback(() => {
    console.log('You got a message!');
  }, []);

  const onConferenceJoined = useCallback(async () => {
    if (userType == 'user') {
      const totalTime = calculateMinutes(
        selectedEvent.starttime,
        selectedEvent.endtime
      );
      const reminderTime = (totalTime - 10) * 60;
      console.log('Total Time', reminderTime);
      const id = await schedulePushNotification(reminderTime);
      console.log('notification', id);
      setNotificationId(id);
    }
    const resActive = await findActiveCallLog(selectedEvent.bookingid);
    if (resActive) {
      console.log('Active Call Log Found', resActive);
      setCallId(resActive);
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
