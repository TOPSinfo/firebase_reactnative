# React Native Astrology App

![](https://github.com/TOPSinfo/firebase_reactnative/blob/main/Simulator%20Screen%20Recording%20-%20iPhone.gif)

## User Guide

User Authentication

- Login: Users can log in using their mobile number and a one-time password (OTP). This secure process ensures that only authorized users can access the app.
- OTP Verification: Upon entering the mobile number, an OTP is sent to the user's device for verification. Users must enter this OTP to complete the login process.
  Dashboard Screen

- Overview: After logging in, users are navigated to the Dashboard screen.
- Astrologer List: The dashboard displays a list of astrologers, providing a quick overview of available experts. Users can explore more details by selecting an astrologer from this list.

Astrologer List Screen

- Access: From the dashboard, users can navigate to the Astrologer List screen.
- Details: This screen provides a complete list of all registered astrologers, allowing users to browse and select astrologers for further interaction.

## Credentials

- Phone Number - 9876543210
- OTP - 123456

## Technical Details

- Minimum OS - iOS 15, Android 8
- Framework - React Native Expo (0.74.5)

## Dependencies

- Expo router
- Expo splash screen
- Async storage
- moment
- Redux
- React Hook Form
- Firebase Authentication
- Firebase Firestore
- React Native Reanimated

# UI controls

- View: A container that wraps all components. Used as the main layout wrapper (style={styles.container}).
- Text: Displays text on the screen. Used for headings and instructions.
- FlatList: Renders a scrollable list of items efficiently. Displays a list of items using the data array, with keyExtractor to set unique keys.
- Pressable: Responds to press events. Used as a custom clickable item with onPress.
- ScrollView: Makes the entire screen scrollable. Wraps the content to allow vertical scrolling.
- Button: A clickable button component. When pressed, it shows an alert with the value from TextInput.
- TextInput: A component to capture user input. Allows the user to type in the text field and stores the input value in textInputValue.
- ActivityIndicator: Displays a loading spinner. Shows up while data is being "loaded" (simulated with a setTimeout here).

## Learn More

To learn more about React Native, take a look at the following :

- [React Native Website](https://reactnative.dev) - learn more about React Native.
