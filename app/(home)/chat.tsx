import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
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
import {
  endChat,
  getMessageSnapshot,
  getMoreMessages,
  sendMessage,
} from '@/services/db';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import {
  messagesSelector,
  userSelector,
  userTypeSelector,
} from '@/redux/selector';
import { useDispatch } from 'react-redux';
import { resetMessages } from '@/redux/userSlice';
import { Fonts } from '@/constants/Fonts';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
const Chat = () => {
  const [messageText, setmessageText] = useState('');
  const [loadMore, setLoadMore] = useState(false);
  const { boookingid, username, profileimage, receiverid, status } =
    useLocalSearchParams<{
      boookingid: string;
      username: string;
      profileimage: any;
      receiverid: string;
      status: string;
    }>();
  const messages = messagesSelector();
  const userdata = userSelector();
  const userType = userTypeSelector();

  useEffect(() => {
    if (messages.length > 40) {
      setLoadMore(true);
    } else {
      setLoadMore(false);
    }
  }, [messages]);

  const isViewOnly =
    status == 'completed' || status == 'rejected' || status == 'deleted';
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      return () => {
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
          }),
        });
      };
    }, [])
  );

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

  /**
   * Handles sending messages.
   *
   * @param {any} messages - The messages to be sent. Expects an array with at least one message object.
   * @returns {Promise<void>} - A promise that resolves when the message is sent.
   *
   * The function constructs a data object from the first message in the array and additional user and receiver information.
   * It then logs the data object to the console and sends the message using the sendMessage function.
   */
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
      const res = await sendMessage(data, userdata.fullname, boookingid);
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
      <View>
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
            display: 'none',
          }}
        />
        <View
          style={{
            alignItems: props.position == 'left' ? 'flex-start' : 'flex-end',
            paddingHorizontal: horizontalScale(4),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={styles.timeText}>
              {new Date(props.currentMessage.createdAt).toLocaleTimeString(
                'en-US',
                { hour: '2-digit', minute: '2-digit' }
              )}
            </Text>
            {props.position == 'right' && props.currentMessage.received && (
              <SvgImage
                url={Images.double_tick}
                style={{
                  height: moderateScale(12),
                  width: moderateScale(12),
                  marginLeft: verticalScale(5),
                  tintColor: userType == 'user' ? Colors.orange : Colors.blue,
                }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  /**
   * Navigates the user to the video call page when called.
   *
   * This function uses the router to navigate to the '/(home)/videocall' route.
   */
  const onCallPress = () => {
    router.navigate('/(home)/videocall');
  };

  /**
   * Ends the chat session by calling the `endChat` function with the booking ID.
   * If the chat session is successfully ended, navigates to the my bookings page.
   *
   * @async
   * @function endChatSession
   * @returns {Promise<void>} A promise that resolves when the chat session is ended and the navigation is complete.
   */
  const endChatSession = async () => {
    const res = await endChat(boookingid);
    if (res) {
      router.navigate('/(home)/(tabs)/(myBookings)');
    }
  };

  /**
   * Handles the end chat button press event.
   * Displays a confirmation alert to the user.
   * If the user confirms, the chat session is ended.
   */
  const onEndPress = async () => {
    Alert.alert('End Chat', 'Are you sure you want to end chat?', [
      {
        text: 'Yes',
        onPress: endChatSession,
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ]);
  };

  const renderRight = () => {
    if (isViewOnly) return null;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={onCallPress}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}>
          <SvgImage
            url={Images.call}
            style={{ height: verticalScale(16), width: verticalScale(16) }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onEndPress}
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

  /**
   * Handles the attachment button press event.
   * Launches the image library for the user to pick an image.
   * If an image is selected, sends the image as a message.
   *
   * @async
   * @function onPressAttachment
   * @returns {Promise<void>} A promise that resolves when the image is sent as a message.
   */
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
      const res = await sendMessage(data, userdata.fullname, boookingid);
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
          multiline={false}
        />
      </View>
    );
  };

  const renderInputToolbar = (props: InputToolbarProps<IMessage>) => {
    if (isViewOnly) return null;
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

  /**
   * Loads more messages by calling the `getMoreMessages` function with the sender and receiver IDs.
   * Updates the state with the result of the call.
   *
   * @async
   * @function onLoadMore
   * @returns {Promise<void>} A promise that resolves when the messages are loaded and the state is updated.
   */
  const onLoadMore = async () => {
    const res = await getMoreMessages({
      senderid: userdata.uid,
      receiverid: receiverid,
    });
    setLoadMore(res ?? false);
  };

  const renderEmpty = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.messageText}>No messages</Text>
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
        listViewProps={{
          inverted: messages.length !== 0,
        }}
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
        renderTime={() => null}
        user={{
          _id: userdata.uid,
        }}
        timeTextStyle={{
          left: styles.timeText,
          right: styles.timeText,
        }}
        bottomOffset={Platform.OS == 'ios' ? verticalScale(-25) : 0}
        loadEarlier={loadMore}
        onLoadEarlier={onLoadMore}
        renderChatEmpty={renderEmpty}
      />
      <StatusBar style="dark" translucent={true} />
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
    color: Colors.white7,
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

export default Chat;
