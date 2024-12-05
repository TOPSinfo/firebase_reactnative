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
  InputToolbarProps,
  ComposerProps,
  InputToolbar,
} from 'react-native-gifted-chat';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
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
import * as ImagePicker from 'expo-image-picker';

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
    dispatch(resetMessages());
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
        status: 'SEND',
        url: '',
        video_url: '',
      };
      console.log('Data', data);
      const res = await sendMessage(data);
    }
  };

  const renderSend = useCallback((props: SendProps<IMessage>) => {
    return (
      <Send {...props} containerStyle={{ paddingLeft: 10 }}>
        <SvgImage
          url={userType == 'user' ? Images.send : Images.send_blue}
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
        tickStyle={{
          color: userType == 'user' ? Colors.orange : Colors.blue,
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

  const onPressAttachment = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const data = {
        messagetext: '',
        senderid: userdata.uid,
        receiverid: receiverid,
        messagetype: 'IMAGE',
        status: 'SEND',
        url: result.assets[0].uri,
        video_url: '',
      };
      const res = await sendMessage(data);
    }
  };

  const renderComposer = (props: ComposerProps) => {
    return (
      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={onPressAttachment}
          style={styles.attachmentContainer}>
          <SvgImage
            url={Images.photo}
            style={{ height: verticalScale(14), width: verticalScale(14) }}
          />
        </TouchableOpacity>
        <Composer
          {...props}
          placeholder="Type message here"
          placeholderTextColor={Colors.grey}
          composerHeight={verticalScale(45)}
          textInputStyle={styles.composerTxt}
        />
      </View>
    );
  };

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          borderTopWidth: 0,
          margin: horizontalScale(15),
          height: verticalScale(60),
          justifyContent: 'center',
        }}
      />
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
        alwaysShowSend
        renderInputToolbar={renderInputToolbar}
        renderComposer={renderComposer}
        renderBubble={renderBubble}
        lightboxProps={{
          activeProps: {
            style: {
              flex: 1,
              width: '100%',
              resizeMode: 'contain',
            },
          },
        }}
        renderAvatar={null}
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
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: horizontalScale(7),
    backgroundColor: Colors.white3,
    height: verticalScale(50),
    alignItems: 'center',
  },
  composerTxt: {
    color: Colors.black1,
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    paddingVertical: verticalScale(10),
  },
  attachmentContainer: {
    height: verticalScale(50),
    width: verticalScale(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default chat;
