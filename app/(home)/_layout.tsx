import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="astrologer" />
        </Stack>
    )
}

export default _layout