import React from 'react';
import { Tabs } from 'expo-router';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import {
  horizontalScale,
  isIphoneX,
  moderateScale,
  verticalScale,
} from '@/utils/matrix';
import { Colors } from '@/constants/Colors';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Fonts } from '@/constants/Fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Shadow } from 'react-native-shadow-2';
import { userTypeSelector } from '@/redux/selector';
import { userAppColor } from '@/hooks/useAppColor';

const TabBarButton = ({ title, icon, onPress, focused }: any) => {
  const colorScheme = userAppColor();
  const color = focused ? colorScheme : Colors.grey;
  const indicatorColor = focused ? colorScheme : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.tab,
        {
          transform: [
            { translateY: focused ? verticalScale(isIphoneX ? -40 : -22) : 1 },
          ],
        },
      ]}>
      <View style={styles.iconContainer}>
        <SvgImage
          url={icon}
          style={{
            height: verticalScale(20),
            width: verticalScale(20),
            tintColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: horizontalScale(-10),
            height: 3.5,
            backgroundColor: indicatorColor,
            width: 3.5,
            borderRadius: 3.5,
          }}
        />
      </View>
      <Text style={[styles.tabTitle, { color: color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const TabBarComponent = ({ state, descriptors, navigation }: any) => {
  const inset = useSafeAreaInsets();
  const userType = userTypeSelector();

  return (
    <Shadow
      style={{ width: '100%' }}
      distance={35}
      offset={[3, -5]}
      startColor="rgba(0,0,0,0.05)">
      <View
        style={{
          ...styles.tabContainer,
          height: verticalScale(65) + inset.bottom,
          flexDirection: 'row',
        }}>
        {state.routes.map((route: any, index: number) => {
          if (userType !== 'user' && index === 2) {
            return null;
          }
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          const tabLabel = () => {
            if (index === 0) {
              return 'Home';
            }
            if (index === 1) {
              return 'My Bookings';
            }
            if (index === 2) {
              return 'Wallet';
            }
            if (index === 3) {
              return 'Profile';
            }
          };

          const tabIcon = () => {
            if (index === 0) {
              return Images.home;
            }
            if (index === 1) {
              return Images.calendar;
            }
            if (index === 2) {
              return Images.wallet;
            }
            if (index === 3) {
              return Images.user;
            }
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}>
              <TabBarButton
                title={tabLabel()}
                icon={tabIcon()}
                onPress={onPress}
                focused={isFocused}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Shadow>
  );
};

const TabLayout = () => {
  const userType = userTypeSelector();
  if (userType === 'user') {
    return (
      <Tabs
        tabBar={props => <TabBarComponent {...props} />}
        screenOptions={{
          tabBarActiveTintColor: Colors.orange,
          headerShown: false,
        }}>
        <Tabs.Screen name="home" />
        <Tabs.Screen name="(myBookings)" />
        <Tabs.Screen name="wallet" />
        <Tabs.Screen name="profile" />
      </Tabs>
    );
  }
  return (
    <Tabs
      tabBar={props => <TabBarComponent {...props} />}
      screenOptions={{
        tabBarActiveTintColor: Colors.orange,
        headerShown: false,
      }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="(myBookings)" />
      <Tabs.Screen
        name="wallet"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    borderTopWidth: 0,
    borderTopLeftRadius: horizontalScale(10),
    borderTopRightRadius: horizontalScale(10),
    backgroundColor: Colors.white,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: verticalScale(40),
    width: verticalScale(40),
    borderRadius: verticalScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  tabTitle: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
  },
});
export default TabLayout;
