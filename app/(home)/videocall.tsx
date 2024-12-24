import React, { useCallback, useRef } from 'react';
import { View, Text } from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { router } from 'expo-router';
import { selectedEventSelector, userSelector } from '@/redux/selector';

const videocall = () => {
  const jitsiMeeting = useRef(null);
  const selectedEvent = selectedEventSelector();
  const userdata = userSelector();
  console.log('Selected Event', selectedEvent);

  const onReadyToClose = useCallback(() => {
    router.back();
    // @ts-ignore
    // @ts-ignore
    jitsiMeeting.current?.close();
  }, []);

  const onEndpointMessageReceived = useCallback(() => {
    console.log('You got a message!');
  }, []);

  const onConferenceJoined = useCallback(() => {
    console.log('Conference Joined');
  }, []);

  const onParticipantJoined = useCallback(() => {
    console.log('Participant Joined');
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
    onConferenceJoined,
    onParticipantJoined,
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
      serverURL={'https://meet.jit.si/'}
      //serverURL="https://meet.ffmuc.net/"
      //serverURL="https://meet.guifi.net"
    />
  );
};

export default videocall;
