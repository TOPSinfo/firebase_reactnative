import DetailsHeader from '@/components/DetailsHeader';
import SvgImage from '@/components/SvgImage';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Images } from '@/constants/Images';
import { setLoading } from '@/redux/loadingSlice';
import { getAstrologer } from '@/services/db';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '@/components/Button';
import ReviewCard from '@/components/ReviewCard';
import Ratings from '@/components/Ratings';
import { onChangeEventData } from '@/redux/eventSlice';
import { useLanguage, useSpeciality } from '@/hooks/useAppData';

const appoinmentTime = [
  '08:30 AM',
  '09:30 AM',
  '10:30 AM',
  '11:30 AM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
  '05:30 PM',
  '06:30 PM',
  '07:30 PM',
];

const Details = () => {
  const [details, setDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any>([]);
  const [showReadMore, setShowReadMore] = useState(false);
  const [date, setDate] = useState(moment().format('DD MMM YYYY'));
  const { id } = useLocalSearchParams<{ id: string }>();

  const disptach = useDispatch();

  const languages = useLanguage(details?.languages);
  const specialities = useSpeciality(details?.speciality);

  /**
   * Fetches the details of an astrologer and updates the state accordingly.
   *
   * This function performs the following steps:
   * 1. Dispatches an action to set the loading state to true.
   * 2. Fetches the astrologer details using the provided `id`.
   * 3. Logs the fetched details to the console.
   * 4. If the response is valid, updates the details and reviews state.
   * 5. Checks if the astrologer's about section length exceeds 325 characters and sets the showReadMore state if true.
   * 6. Dispatches an action to set the loading state to false.
   *
   * @async
   * @function getDetails
   * @returns {Promise<void>} A promise that resolves when the details have been fetched and state has been updated.
   */
  const getDetails = async () => {
    disptach(setLoading(true));
    const res: any = await getAstrologer(id);
    console.log('Details', res);
    if (res) {
      setDetails(res.astrologer);
      setReviews(res.reviews);
      if (res.astrologer?.aboutyou?.length > 325) {
        setShowReadMore(true);
      }
      disptach(setLoading(false));
    }
  };

  useEffect(() => {
    getDetails();
  }, []);

  const renderTiming = ({ item, index }: any) => {
    return (
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item}</Text>
      </View>
    );
  };

  /**
   * Handles the "Show More" button press event.
   * When invoked, it sets the state to hide the "Read More" section.
   */
  const onShowMorePress = () => {
    setShowReadMore(false);
  };

  /**
   * Handles the "Book Now" button click event.
   * Dispatches an action to update event data with the selected astrologer's details
   * and navigates to the event screen.
   *
   * @async
   * @function onBookNow
   * @returns {Promise<void>} A promise that resolves when the action is dispatched and navigation is complete.
   */
  const onBookNow = async () => {
    disptach(
      onChangeEventData({
        astrologerid: details?.id,
        astrologername: details?.fullname,
        astrologercharge: details?.price,
        date: date,
      })
    );
    router.navigate('/(home)/eventscreen');
  };

  const renderReview = ({ item, index }: any) => {
    return <ReviewCard key={item.id} item={item} />;
  };

  /**
   * Handles the "Next" button click event.
   * Updates the state to the next day's date.
   */
  const onNext = () => {
    setDate(moment(date, 'DD MMM').add(1, 'days').format('DD MMM YYYY'));
  };

  /**
   * Handles the action to go to the previous date.
   * If the current date is the same as today's date, the function will return without making any changes.
   * Otherwise, it will set the date to the previous day.
   *
   * @returns {void}
   */
  const onPrev = () => {
    if (
      moment(date, 'DD MMM YYYY').format('DD MMM YYYY') ==
      moment().format('DD MMM YYYY')
    )
      return;
    setDate(
      moment(date, 'DD MMM YYYY').subtract(1, 'days').format('DD MMM YYYY')
    );
  };

  const renderRight = () => {
    return (
      <TouchableOpacity
        onPress={onBookNow}
        style={{
          width: '10%',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <SvgImage
          url={Images.plus}
          style={{
            height: horizontalScale(16),
            width: horizontalScale(16),
          }}
        />
      </TouchableOpacity>
    );
  };

  if (!details) return null;

  return (
    <View style={{ flex: 1 }}>
      <DetailsHeader title={'Astrologer'} rightOption={renderRight()} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: horizontalScale(20) }}>
          <View
            style={{
              padding: horizontalScale(20),
              borderBottomWidth: 0.5,
              borderColor: Colors.white1,
            }}>
            <View>
              {details?.profileimage ? (
                <SvgImage
                  url={details?.profileimage}
                  style={{
                    height: horizontalScale(200),
                    width: horizontalScale(335),
                    borderRadius: horizontalScale(6),
                  }}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderImageContainer}>
                  <SvgImage
                    url={Images.user}
                    style={{
                      height: horizontalScale(80),
                    }}
                  />
                </View>
              )}
              <SvgImage
                url={Images.heart}
                style={{
                  height: horizontalScale(16),
                  width: horizontalScale(16),
                  position: 'absolute',
                  top: 15,
                  right: 15,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: horizontalScale(17),
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.name}>{details?.fullname}</Text>
                <SvgImage
                  url={Images.verified}
                  style={{
                    height: horizontalScale(16),
                    width: horizontalScale(16),
                    marginLeft: horizontalScale(3),
                  }}
                />
              </View>
              <TouchableOpacity style={styles.rateButton}>
                <SvgImage
                  url={Images.rupee_white}
                  style={{
                    height: horizontalScale(12),
                    width: horizontalScale(12),
                  }}
                />
                <Text style={styles.rate}>{`${details?.price}/min`}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ flexDirection: 'row', marginTop: horizontalScale(10) }}>
              <View
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <SvgImage
                  url={Images.language}
                  style={{
                    height: horizontalScale(13),
                    width: horizontalScale(13),
                    marginLeft: horizontalScale(3),
                  }}
                />
                <Text numberOfLines={1} style={styles.skills}>
                  {languages.join(', ')}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: horizontalScale(10),
                  flex: 1,
                }}>
                <SvgImage
                  url={Images.skills}
                  style={{
                    height: horizontalScale(13),
                    width: horizontalScale(13),
                    marginLeft: horizontalScale(3),
                  }}
                />
                <Text numberOfLines={1} style={styles.skills}>
                  {specialities.join(', ')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: horizontalScale(18),
                justifyContent: 'space-between',
              }}>
              <View style={styles.box}>
                <Text style={styles.boxLabel}>
                  {details?.experience > 0
                    ? `${details?.experience}yr+`
                    : details?.experience}
                </Text>
                <Text style={[styles.skills, { marginLeft: 0 }]}>
                  Experience
                </Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxLabel}>{`${details?.rating}`}</Text>
                <Text style={[styles.skills, { marginLeft: 0 }]}>Rating</Text>
              </View>
              <View style={styles.box}>
                <Text style={styles.boxLabel}>
                  {details?.consults > 10
                    ? `${details?.consults} +`
                    : details?.consults}
                </Text>
                <Text style={[styles.skills, { marginLeft: 0 }]}>Consults</Text>
              </View>
            </View>
          </View>
          <View style={{ borderBottomWidth: 0.5, borderColor: Colors.white1 }}>
            <View style={{ padding: horizontalScale(20) }}>
              <Text style={styles.name}>Book an appointment</Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: horizontalScale(15),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: horizontalScale(10),
                }}>
                <TouchableOpacity onPress={onPrev}>
                  <MaterialIcons
                    name="arrow-back-ios"
                    size={horizontalScale(15)}
                    color={Colors.grey}
                  />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                  <SvgImage
                    url={Images.calendar}
                    style={{
                      height: horizontalScale(20),
                      width: horizontalScale(20),
                      tintColor: Colors.orange,
                    }}
                  />
                  <Text style={styles.date}>{`${
                    moment().format('DD MMM') == date ? 'Today,' : ''
                  } ${date}`}</Text>
                </View>
                <TouchableOpacity onPress={onNext}>
                  <MaterialIcons
                    name="arrow-forward-ios"
                    size={horizontalScale(15)}
                    color={Colors.grey}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* <FlatList
              style={{ paddingBottom: horizontalScale(20) }}
              contentContainerStyle={{ paddingLeft: horizontalScale(10) }}
              data={appoinmentTime}
              renderItem={renderTiming}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            /> */}
          </View>
          <View
            style={{
              padding: horizontalScale(20),
              borderBottomWidth: 0.5,
              borderColor: Colors.white1,
            }}>
            <Text style={styles.name}>About</Text>
            <Text
              style={[
                styles.skills,
                { marginTop: horizontalScale(10), textAlign: 'justify' },
              ]}>
              {showReadMore
                ? details?.aboutyou.substring(0, 325)
                : details?.aboutyou
                ? details?.aboutyou
                : 'Astrologer has not provided any information about themselves.'}
              {showReadMore ? (
                <Text
                  onPress={onShowMorePress}
                  style={{ color: Colors.orange }}>
                  {' '}
                  Read More...
                </Text>
              ) : null}
            </Text>
          </View>
          {reviews.length ? (
            <View style={{ padding: horizontalScale(20) }}>
              <Text style={styles.name}>Review</Text>
              <Text
                style={[
                  styles.skills,
                  { marginLeft: 0, marginBottom: horizontalScale(18) },
                ]}>
                98% of customers recommend Prasanta, based on reviews.
              </Text>
              <Ratings rating={details?.rating} />
              {reviews.map((review: any, index: number) =>
                renderReview({ item: review, index })
              )}
            </View>
          ) : null}
          <View
            style={{
              paddingHorizontal: horizontalScale(20),
              marginTop: horizontalScale(10),
            }}>
            <Button title="Book Now" onPress={onBookNow} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  name: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black1,
  },
  rateButton: {
    paddingHorizontal: horizontalScale(8),
    height: horizontalScale(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: horizontalScale(4),
    backgroundColor: Colors.orange,
  },
  rate: {
    fontSize: moderateScale(10),
    fontFamily: Fonts.PoppinsBold,
    color: Colors.white,
  },
  skills: {
    fontSize: moderateScale(10),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
    marginLeft: horizontalScale(5),
  },
  box: {
    height: horizontalScale(60),
    width: '30%',
    borderWidth: 0.5,
    borderRadius: horizontalScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.white1,
  },
  boxLabel: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
  },
  date: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
    marginTop: horizontalScale(10),
  },
  timeContainer: {
    height: horizontalScale(25),
    borderRadius: horizontalScale(12.5),
    paddingHorizontal: horizontalScale(15),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.orange1,
    marginRight: horizontalScale(10),
    borderColor: Colors.orange,
  },
  time: {
    fontSize: horizontalScale(10),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.orange,
  },
  placeholderImageContainer: {
    height: horizontalScale(200),
    width: horizontalScale(335),
    borderRadius: horizontalScale(6),
    justifyContent: 'center',
    backgroundColor: Colors.white4,
  },
});

export default Details;
