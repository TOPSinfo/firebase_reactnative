import { useRouter } from 'expo-router';
import React, { ReactElement } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { getDefaultHeaderHeight } from '@/utils/helper';

const TabHeader = ({
  title,
  right,
}: {
  title: string;
  right?: ReactElement;
}) => {
  const insets = useSafeAreaInsets();
  const frame = useSafeAreaFrame();

  const statusBarHeight = insets.top;
  const defaultHeight = getDefaultHeaderHeight(frame, false, statusBarHeight);

  return (
    <View style={{ height: defaultHeight + 10, backgroundColor: Colors.white }}>
      <View pointerEvents="none" style={{ height: statusBarHeight }} />
      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={styles.title}>{title}</Text>
        </View>
        {right}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(20),
  },
  title: {
    fontSize: moderateScale(18),
    color: Colors.black1,
    fontFamily: Fonts.PoppinsBold,
  },
});

export default TabHeader;
