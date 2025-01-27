import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="astrologer" />
      <Stack.Screen name="details" />
      <Stack.Screen name="eventscreen" />
      <Stack.Screen name="editprofile" options={{ gestureEnabled: false }} />
      <Stack.Screen
        name="editastroprofile"
        options={{ gestureEnabled: false }}
      />
    </Stack>
  );
};

export default _layout;
