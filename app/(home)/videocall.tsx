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
    <View style={{ flex: 1 }}>
      <JitsiMeeting
        config={{}}
        eventListeners={eventListeners as any}
        ref={jitsiMeeting}
        style={{ flex: 1 }}
        room={'astro_appointment'}
        serverURL={'https://meet.jit.si/'}
      />
    </View>
  );
};

export default videocall;
