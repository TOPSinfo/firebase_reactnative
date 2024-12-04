import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import DetailsHeader from '@/components/DetailsHeader';
import {
  GiftedChat,
  IMessage,
  Send,
  SendProps,
  Bubble,
  BubbleProps,
  Composer,
} from 'react-native-gifted-chat';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import {
  height,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '@/utils/matrix';
import { getMessageSnapshot, sendMessage } from '@/services/db';
import { useLocalSearchParams } from 'expo-router';
import {
  messagesSelector,
  userSelector,
  userTypeSelector,
} from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { resetMessages } from '@/redux/userSlice';
import { Fonts } from '@/constants/Fonts';

const chat = () => {
  const [messageText, setmessageText] = useState('');
  const { username, profileimage, receiverid } = useLocalSearchParams<{
    username: string;
    profileimage: any;
    receiverid: string;
  }>();
  const messages = messagesSelector();
  const userdata = userSelector();
  const userType = userTypeSelector();

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

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor:
              userType == 'user' ? Colors.orange1 : Colors.white3,
            borderRadius: horizontalScale(7),
          },
          left: {
            backgroundColor:
              userType == 'user' ? Colors.white3 : Colors.lightBlue,
            borderRadius: horizontalScale(7),
          },
        }}
        textStyle={{
          right: styles.messageText,
          left: styles.messageText,
        }}
      />
    );
  };

  const renderRight = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => {}}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
          <SvgImage
            url={Images.call}
            style={{ height: verticalScale(16), width: verticalScale(16) }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {}}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          style={{
            marginLeft: horizontalScale(15),
            paddingRight: horizontalScale(10),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontFamily: Fonts.PoppinsRegular,
              color: Colors.white,
              fontSize: moderateScale(12),
            }}>
            End
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const customtInputToolbar = () => {
    return (
      <View style={styles.customInputView}>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachmentContainer}>
            <SvgImage
              url={Images.photo}
              style={{ height: verticalScale(14), width: verticalScale(14) }}
            />
          </TouchableOpacity>
          <Composer
            placeholder="Type message here"
            placeholderTextColor={Colors.grey}
            text={messageText}
            onTextChanged={val => {
              setmessageText(val.trim());
            }}
            textInputStyle={styles.composerTxt}
          />
        </View>
        <Send
          onSend={messages => onSend(messages)}
          alwaysShowSend={true}
          disabled={!messageText}
          containerStyle={{ justifyContent: 'center', paddingHorizontal: 10 }}>
          <SvgImage
            url={userType == 'user' ? Images.send : Images.send_blue}
            style={{ height: verticalScale(50), width: verticalScale(50) }}
          />
        </Send>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DetailsHeader
        title={username}
        profileImage={profileimage}
        isChat={true}
        rightOption={renderRight()}
      />
      <GiftedChat
        messages={messages}
        text={messageText}
        onInputTextChanged={setmessageText}
        onSend={messages => onSend(messages)}
        renderSend={renderSend}
        renderInputToolbar={customtInputToolbar}
        renderBubble={renderBubble}
        renderAvatar={() => null}
        user={{
          _id: userdata.uid,
        }}
        timeTextStyle={{
          left: styles.timeText,
          right: styles.timeText,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  messageText: {
    color: Colors.black1,
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
  },
  timeText: {
    color: Colors.grey,
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
  },
  customInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: horizontalScale(15),
    height: verticalScale(55),
  },
  inputContainer: {
    flexDirection: 'row',
    borderRadius: horizontalScale(7),
    backgroundColor: Colors.white3,
    alignItems: 'center',
    height: verticalScale(50),
    flex: 1,
  },
  composerTxt: {
    color: Colors.black1,
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    paddingTop: 0,
  },
  attachmentContainer: {
    height: verticalScale(40),
    width: verticalScale(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default chat;
