import { Colors } from '@/constants/Colors';
import { getRandomColor } from '@/utils/helper';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { Fonts } from '@/constants/Fonts';
import moment from 'moment';

const ReviewCard = ({ item }: { item: any }) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.colorContainer,
                { backgroundColor: getRandomColor() },
              ]}>
              <Text style={styles.firstLetter}>
                {item.username.slice(0, -item.username.length + 1)}
              </Text>
            </View>
            <Text style={styles.name}>{item.username}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: horizontalScale(5),
            }}>
            {[...Array(Number(item.rating)).keys()].map((key, index) => {
              return (
                <SvgImage
                  key={key + index}
                  url={Images.star}
                  style={styles.star}
                />
              );
            })}
          </View>
        </View>
        <View style={{ marginTop: horizontalScale(5) }}>
          <Text style={styles.date}>
            {moment(item.createdat.seconds * 1000).format('DD MMMM YYYY')}
          </Text>
        </View>
      </View>
      <Text
        style={[
          styles.skills,
          { marginTop: horizontalScale(15), marginLeft: 0 },
        ]}>
        {item.feedback}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: horizontalScale(15),
    borderWidth: 0.5,
    borderColor: Colors.white1,
    borderRadius: horizontalScale(10),
    padding: horizontalScale(15),
  },
  name: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black1,
  },
  skills: {
    fontSize: moderateScale(10),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.black1,
  },
  colorContainer: {
    height: horizontalScale(25),
    width: horizontalScale(25),
    borderRadius: horizontalScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(5),
  },
  firstLetter: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(12),
    color: Colors.white,
  },
  star: {
    height: horizontalScale(13),
    width: horizontalScale(13),
    marginRight: horizontalScale(5),
  },
  date: {
    fontFamily: Fonts.PoppinsRegular,
    fontSize: moderateScale(10),
    color: Colors.black1,
  },
});

export default ReviewCard;
