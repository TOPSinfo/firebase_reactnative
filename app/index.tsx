import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { Colors } from '@/constants/Colors';
import { app } from '@/services/config';
console.log('app', app);

const index = () => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const onAuthStateChanged = async (user: any) => {
    console.log('User auth status', user);
    setLoading(false);
    if (user) {
      router.replace('/(home)/(tabs)/home');
    } else {
      router.replace('/(auth)');
    }
  };

  useEffect(() => {
    const subscriber = getAuth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (!loading) return null;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <ActivityIndicator size={'large'} color={Colors.orange} />
    </View>
  );
};

export default index;
