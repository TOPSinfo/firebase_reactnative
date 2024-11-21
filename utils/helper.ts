import { Colors } from '@/constants/Colors';
import moment from 'moment';
import { StatusBar, PixelRatio, Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';

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
    backgroundColor: Colors.red,
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
