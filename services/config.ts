import { initializeApp } from 'firebase/app';
import {
    initializeAuth,
    // @ts-ignore
    getReactNativePersistence
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: "sales-astrology-reactnative.firebaseapp.com",
    projectId: "sales-astrology-reactnative",
    storageBucket: "sales-astrology-reactnative.appspot.com",
    messagingSenderId: process.env.EXPO_PUBLIC_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage();

export { app, auth, db, storage, firebaseConfig }
