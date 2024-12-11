import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import SvgImage from '@/components/SvgImage';
import { Images } from '@/constants/Images';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import DashboardHeader from '@/components/DashboardHeader';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import AstrologersList from '@/components/AstrologersList';
import Banner from '@/components/Banner';
import Upcoming from '@/components/Upcoming';
import {
  getAstrologers,
  getLanguagesAndSpecialities,
  getMyBookings,
  getUser,
} from '@/services/db';
import { astrologersSelector, userTypeSelector } from '@/redux/selector';
import UserRequestList from '@/components/UserRequestList';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/redux/loadingSlice';
import { registerForPushNotificationsAsync } from '@/utils/helper';
import * as Notifications from 'expo-notifications';

const Home = () => {
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  const astrologers = astrologersSelector();
  const userType = userTypeSelector();
  const dispatch = useDispatch();

  const getInitialNotification = async () => {
    const response = await Notifications.getLastNotificationResponseAsync();
    if (response) {
      console.log(
        'Initial Notification',
        response.notification.request.content
      );
      // if (response.notification.request.content.data) {
      //     handleNotification(response.notification.request.content.data)
      // }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      registerForPushNotificationsAsync()
        .then(token => {
          if (token) {
            console.log('Push token', token);
          }
        })
        .catch(error => console.log('Error getting push token', error));
      getInitialNotification();
      notificationListener.current =
        Notifications.addNotificationReceivedListener(notification => {
          console.log('Notification received', notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(response => {
          console.log(
            'Response recieved',
            response.notification.request.content
          );
          // if (response.notification.request.content.data &&) {
          //     handleNotification(response.notification.request.content.data)
          // }
        });
    }, 2000);
    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  /**
   * Navigates to the astrologer page.
   */
  const onViewAll = () => {
    if (userType == 'user') {
      router.push('/(home)/astrologer');
    } else {
      router.push('/(home)/users');
    }
  };

  /**
   * Fetches astrologers from the server.
   *
   * @returns {Promise<void>} A promise that resolves when the astrologers are fetched.
   */
  const fetchAstrologers = async () => {
    dispatch(setLoading(true));
    await getUser();
    await getLanguagesAndSpecialities();
    if (userType == 'user') {
      await getAstrologers();
    } else {
      await getMyBookings();
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    fetchAstrologers();
  }, []);

  return (
    <View style={styles.container}>
      <SvgImage
        url={
          userType == 'user'
            ? Images.homeBackground
            : Images.homeBackground_orange
        }
        style={styles.background}
      />
      <ScrollView
        style={{ flex: 1, padding: horizontalScale(20) }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: horizontalScale(50) }}>
        <DashboardHeader />
        <View style={{ marginTop: horizontalScale(25) }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: horizontalScale(15),
            }}>
            <Text style={styles.label}>
              {userType == 'user' ? 'Top Astrologers' : 'Users Request'}
            </Text>
            <TouchableOpacity>
              <Text onPress={onViewAll} style={styles.viewAll}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {userType == 'user' ? (
            <AstrologersList data={astrologers} />
          ) : (
            <UserRequestList />
          )}
          <Banner />
          {userType == 'user' ? (
            <View style={{ marginTop: horizontalScale(28) }}>
              <Text style={styles.label}>Upcoming</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: horizontalScale(13),
                }}>
                <Upcoming
                  title="Daily Horoscope"
                  logo={Images.horoscope}
                  color={Colors.orange}
                />
                <Upcoming
                  title="Free Kundali"
                  logo={Images.kundali}
                  color={Colors.blue}
                />
                <Upcoming
                  title="Horoscope Matching"
                  logo={Images.matching}
                  color={Colors.yellow}
                />
              </View>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  background: {
    height: horizontalScale(405),
    width: horizontalScale(375),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  label: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black1,
  },
  viewAll: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
  },
});

export default Home;
