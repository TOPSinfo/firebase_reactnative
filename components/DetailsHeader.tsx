import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import SvgImage from './SvgImage';
import { horizontalScale, moderateScale, verticalScale } from '@/utils/matrix';
import { Images } from '@/constants/Images';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { userAppColor } from '@/hooks/useAppColor';
import { getDefaultHeaderHeight } from '@/utils/helper';

const DetailsHeader = ({
  title,
  rightOption,
  isChat,
  profileImage,
  backPress,
}: {
  title: string;
  rightOption?: React.ReactNode;
  isChat?: boolean;
  profileImage?: string;
  backPress?: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const statusBarHeight = insets.top;
  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  const router = useRouter();
  const color = userAppColor();

  /**
   * Navigates the user to the previous page in the browser history.
   * This function uses the router's `back` method to perform the navigation.
   */
  const onBack = () => {
    if (backPress) {
      backPress();
      return;
    }
    router.back();
  };
  return (
    <View style={{ height: defaultHeight + 10 }}>
      <View pointerEvents="none" style={{ height: statusBarHeight }} />
      <View style={[styles.container, { backgroundColor: color }]}>
        <TouchableOpacity
          onPress={onBack}
          style={{ width: '10%', justifyContent: 'center' }}>
          <SvgImage
            url={Images.backArrow}
            style={{ height: horizontalScale(16), width: horizontalScale(16) }}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {isChat ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.profileContainer}>
                <SvgImage
                  url={profileImage ? profileImage : Images.user}
                  style={styles.profile}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.title}>{title}</Text>
            </View>
          ) : (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>
        {rightOption ? rightOption : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.orange,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.white,
    fontFamily: Fonts.PoppinsRegular,
  },
  profileContainer: {
    backgroundColor: Colors.white,
    borderRadius: verticalScale(32),
    height: verticalScale(32),
    width: verticalScale(32),
    marginRight: horizontalScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    height: verticalScale(32),
    width: verticalScale(32),
    borderRadius: verticalScale(32),
  },
});

export default DetailsHeader;
