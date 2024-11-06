import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { loadingSelector } from '../redux/selector';
import { userAppColor } from '@/hooks/useAppColor';

const Loading = () => {
  const isLoading = loadingSelector();
  const color = userAppColor();
  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Loading;
