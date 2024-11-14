import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale } from '@/utils/matrix';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Button from './Button';
import SvgImage from './SvgImage';
import { Images } from '@/constants/Images';
import { Fonts } from '@/constants/Fonts';
import { router } from 'expo-router';
import { useSpeciality } from '@/hooks/useAppData';

type AstrologerCardProps = {
  id: string;
  index: number;
  name: string;
  ratings: number;
  image: string;
  skills: string[];
};

const AstrologerCard = ({
  id,
  index,
  name,
  ratings,
  image,
  skills,
}: AstrologerCardProps) => {
  const specialities = useSpeciality(skills);

  const onBookNow = () => {
    router.push({ pathname: '/(home)/details', params: { id } });
  };

  /**
   * Handles the press event on the astrologer card.
   * Navigates to the details page with the specified astrologer ID.
   *
   * @returns {void}
   */
  const onCardPress = () => {
    router.push({ pathname: '/(home)/details', params: { id } });
  };

  return (
    <TouchableOpacity
      onPress={onCardPress}
      style={[
        styles.container,
        { marginRight: index % 2 == 0 ? horizontalScale(15) : 0 },
      ]}>
      <View>
        {image ? (
          <SvgImage
            url={image}
            style={{
              height: horizontalScale(82),
              borderRadius: horizontalScale(6),
            }}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImageContainer}>
            <SvgImage
              url={Images.user}
              style={{
                height: horizontalScale(40),
              }}
            />
          </View>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: horizontalScale(6),
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.name}>{name}</Text>
          <SvgImage
            url={Images.verified}
            style={{
              height: horizontalScale(10),
              width: horizontalScale(10),
              marginLeft: horizontalScale(3),
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SvgImage
            url={Images.star}
            style={{
              height: horizontalScale(10),
              width: horizontalScale(10),
              marginRight: horizontalScale(3),
            }}
          />
          <Text style={styles.skills}>{ratings}</Text>
        </View>
      </View>
      <View
        style={{
          marginTop: horizontalScale(3),
          marginBottom: horizontalScale(6),
        }}>
        <Text style={styles.skills} numberOfLines={1}>
          {specialities?.join(', ')}
        </Text>
      </View>
      <Button
        title="Book Now"
        isTransparent={true}
        onPress={onBookNow}
        style={{ height: horizontalScale(30) }}
        titleStyle={{
          fontFamily: Fonts.PoppinsRegular,
          fontSize: moderateScale(12),
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: horizontalScale(160),
    backgroundColor: Colors.white,
    marginBottom: horizontalScale(15),
    borderColor: Colors.white2,
    borderWidth: 0.5,
    borderRadius: horizontalScale(5),
    padding: horizontalScale(10),
  },
  name: {
    fontSize: horizontalScale(12),
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.black1,
  },
  skills: {
    fontSize: horizontalScale(10),
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.grey,
  },
  placeholderImageContainer: {
    height: horizontalScale(82),
    borderRadius: horizontalScale(6),
    backgroundColor: Colors.white4,
    justifyContent: 'center',
  },
});

export default AstrologerCard;
