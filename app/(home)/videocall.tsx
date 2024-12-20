import React, { useCallback, useRef } from 'react';
import { View, Text } from 'react-native';
import { JitsiMeeting } from '@jitsi/react-native-sdk';
import { router } from 'expo-router';

const videocall = () => {
  const jitsiMeeting = useRef(null);

  const onReadyToClose = useCallback(() => {
    router.back();
    // @ts-ignore
    // @ts-ignore
    jitsiMeeting.current?.close();
  }, []);

  const onEndpointMessageReceived = useCallback(() => {
    console.log('You got a message!');
  }, []);

  const eventListeners = {
    onReadyToClose,
    onEndpointMessageReceived,
  };

  return (
    <JitsiMeeting
      config={{
        hideConferenceTimer: true,
      }}
      eventListeners={eventListeners as any}
      ref={jitsiMeeting}
      style={{ flex: 1 }}
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
      // serverURL={'https://meet.jit.si/'}
      serverURL="https://meet.ffmuc.net/"
      //serverURL="https://meet.guifi.net"
    />
  );
};

export default videocall;
