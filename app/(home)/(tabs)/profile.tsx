import { View, Text } from 'react-native'
import React from 'react'
import { auth } from '@/services/config'
import { router } from 'expo-router'

const Profile = () => {

    const onLogout = () => {
        auth.signOut()
        router.replace('/(auth)/')
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Coming soon</Text>
            <Text onPress={onLogout}>Logout</Text>
        </View>
    )
}

export default Profile