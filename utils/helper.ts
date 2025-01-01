import { Colors } from '@/constants/Colors';
import moment from 'moment';
import { StatusBar, PixelRatio, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
const sunSignData = [
  {
    name: 'Aries',
    latters: ['A', 'L', 'E', 'I', 'O'],
  },
  {
    name: 'Taurus',
    latters: ['B', 'V', 'U', 'W'],
  },
  {
    name: 'Gemini',
    latters: ['K', 'CHH', 'GH', 'Q', 'C'],
  },
  {
    name: 'Cancer',
    latters: ['DD', 'H'],
  },
  {
    name: 'Leo',
    latters: ['M', 'TT'],
  },
  {
    name: 'Virgo',
    latters: ['P', 'TTHH'],
  },
  {
    name: 'Libra',
    latters: ['R', 'T'],
  },
  {
    name: 'Scorpio',
    latters: ['N', 'Y'],
  },
  {
    name: 'Sagittarius',
    latters: ['BH', 'F', 'DH'],
  },
  {
    name: 'Capricorn',
    latters: ['KH', 'J'],
  },
  {
    name: 'Aquarius',
    latters: ['G', 'S', 'SH'],
  },
  {
    name: 'Pisces',
    latters: ['D', 'CH', 'Z', 'TH'],
  },
];

export const showSuccessMessage = (message: string, title = 'Success') => {
  showMessage({
    message: title,
    description: message,
    type: 'success',
    duration: 2500,
    statusBarHeight: StatusBar.currentHeight,
  });
};

import { MessageType } from 'react-native-flash-message';

export const showErrorMessage = (message: string) => {
  showMessage({
    message: 'Oops!',
    description: message,
    type: 'error' as MessageType,
    duration: 2500,
    backgroundColor: Colors.red1,
    statusBarHeight: StatusBar.currentHeight,
  });
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getSunSign = (name: string) => {
  const firstChar = name.slice(0, 1).toLocaleUpperCase();
  const secondChar = name.slice(1, 2).toLocaleUpperCase();
  const thirdChar = name.slice(2, 3).toLocaleUpperCase();
  const fourthChar = name.slice(3, 4).toLocaleUpperCase();

  let searchChar = firstChar;

  if (firstChar == 'K' && secondChar == 'H') {
    searchChar = firstChar + secondChar;
  }
  if (firstChar == 'C' && secondChar == 'H') {
    if (thirdChar == 'H') {
      searchChar = firstChar + secondChar + thirdChar;
    } else {
      searchChar = firstChar + secondChar;
    }
  }
  if (firstChar == 'G' && secondChar == 'H') {
    searchChar = firstChar + secondChar;
  }
  if (firstChar == 'D' && (secondChar == 'H' || secondChar == 'D')) {
    searchChar = firstChar + secondChar;
  }
  if (firstChar == 'T' && (secondChar == 'T' || secondChar == 'H')) {
    if (thirdChar == 'H' && fourthChar == 'H') {
      searchChar = firstChar + secondChar + thirdChar + fourthChar;
    } else {
      searchChar = firstChar + secondChar;
    }
  }
  if (firstChar == 'B' && secondChar == 'H') {
    searchChar = firstChar + secondChar;
  }
  if (firstChar == 'S' && secondChar == 'H') {
    searchChar = firstChar + secondChar;
  }

  const sunSign = sunSignData.find(item => item.latters.includes(searchChar));
  return sunSign?.name || 'Not Found';
};

export function getDefaultHeaderHeight(
  layout: { width: number; height: number },
  modalPresentation: boolean,
  topInset: number
): number {
  let headerHeight;

  // On models with Dynamic Island the status bar height is smaller than the safe area top inset.
  const hasDynamicIsland = Platform.OS === 'ios' && topInset > 50;
  const statusBarHeight = hasDynamicIsland
    ? topInset - (5 + 1 / PixelRatio.get())
    : topInset;

  const isLandscape = layout.width > layout.height;

  if (Platform.OS === 'ios') {
    if (Platform.isPad || Platform.isTV) {
      if (modalPresentation) {
        headerHeight = 56;
      } else {
        headerHeight = 50;
      }
    } else {
      if (isLandscape) {
        headerHeight = 32;
      } else {
        if (modalPresentation) {
          headerHeight = 56;
        } else {
          headerHeight = 44;
        }
      }
    }
  } else {
    headerHeight = 54;
  }

  return headerHeight + statusBarHeight;
}

export const calculateMinutes = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return 0;
  const duration = moment.duration(
    moment(endTime, 'hh:mm a').diff(moment(startTime, 'hh:mm a'))
  );
  return duration.asMinutes();
};

export const getChatId = (senderid: string, receiverid: string) => {
  return senderid > receiverid
    ? `${senderid}${receiverid}`
    : `${receiverid}${senderid}`;
};

const handleRegistrationError = (errorMessage: any) => {
  console.log('Notification error', errorMessage);
};

export const registerForPushNotificationsAsync = async () => {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!'
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      //const pushTokenString = await Notifications.getDevicePushTokenAsync()
      console.log('push token', pushTokenString);
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
};

export const sendPushNotification = async (
  title: string,
  body: string,
  expoPushToken: string,
  bookingid: string,
  type: string
) => {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    channelId: 'default',
    data: {
      bookingid,
      type,
    },
  };

  console.log('Message', message);

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};

export const schedulePushNotification = async (seconds: number) => {
  if (!seconds) return null;
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Extend Meeting',
      body: 'Your meeting is about to end in 10 minutes, Do you want to extend?',
    },
    trigger: { seconds },
  });
  return id;
};

export const cancelSchedulePushNotification = async (id: any) => {
  await Notifications.cancelScheduledNotificationAsync(id);
  console.log('Notificatino cancel', id);
};
