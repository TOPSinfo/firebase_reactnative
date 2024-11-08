import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect } from 'react';
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
import { getAstrologers, getMyBookings, getUser } from '@/services/db';
import { astrologersSelector, userTypeSelector } from '@/redux/selector';
import UserRequestList from '@/components/UserRequestList';

const Home = () => {
  const astrologers = astrologersSelector();
  const userType = userTypeSelector();
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
    await getUser();
    if (userType == 'user') {
      await getAstrologers();
    } else {
      await getMyBookings();
    }
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
