import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Colors } from '@/constants/Colors';
import DetailsHeader from '@/components/DetailsHeader';
import {
  GiftedChat,
  IMessage,
  Send,
  SendProps,
} from 'react-native-gifted-chat';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { verticalScale } from '@/utils/matrix';
import { getMessageSnapshot, sendMessage } from '@/services/db';
import { useLocalSearchParams } from 'expo-router';
import { messagesSelector, userSelector } from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { resetMessages } from '@/redux/userSlice';

const chat = () => {
  const [messageText, setmessageText] = useState('');
  const { receiverid } = useLocalSearchParams();
  const messages = messagesSelector();
  const userdata = userSelector();

  const dispatch = useDispatch();

  useEffect(() => {
    let unsubscribe: any = null;
    if (userdata.uid) {
      unsubscribe = getMessageSnapshot({
        senderid: userdata.uid,
        receiverid: receiverid,
      });
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
        dispatch(resetMessages());
      };
    }
  }, []);

  const onSend = async (messages: any) => {
    if (messages.length > 0) {
      const data = {
        messagetext: messages[0].text,
        senderid: userdata.uid,
        receiverid: receiverid,
        messagetype: 'TEXT',
        status: '',
        url: '',
        video_url: '',
      };
      console.log('Data', data);
      const res = await sendMessage(data);
    }
  };

  const renderSend = useCallback((props: SendProps<IMessage>) => {
    return (
      <Send
        {...props}
        containerStyle={{ justifyContent: 'center', paddingHorizontal: 10 }}>
        <SvgImage
          url={Images.send}
          style={{ height: verticalScale(50), width: verticalScale(50) }}
        />
      </Send>
    );
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <DetailsHeader title="Chat" />
      <GiftedChat
        messages={messages}
        text={messageText}
        onInputTextChanged={setmessageText}
        onSend={messages => onSend(messages)}
        renderSend={renderSend}
        user={{
          _id: userdata.uid,
        }}
      />
    </View>
  );
};

export default chat;
