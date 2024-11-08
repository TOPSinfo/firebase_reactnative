import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import SvgImage from './SvgImage';
import { horizontalScale } from '@/utils/matrix';
import { useRouter } from 'expo-router';

type UpcomingProps = {
  logo: string;
  title: string;
  color: string;
};

const Upcoming = ({ logo, title, color }: UpcomingProps) => {
  const router = useRouter();
  const onPress = () => {
    router.push('/(home)/comingsoon');
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { borderColor: color }]}>
      <SvgImage
        url={logo}
        style={{ height: horizontalScale(32), width: horizontalScale(32) }}
      />
      <Text style={[styles.title, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: horizontalScale(90),
    width: '30%',
    borderWidth: 0.5,
    borderRadius: horizontalScale(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: horizontalScale(8),
    fontFamily: 'Poppins-Bold',
    marginTop: horizontalScale(12),
  },
});

export default Upcoming;
