import { useFonts } from 'expo-font';

const useFontsHook = () => {
    const [fontsLoaded, fontError] = useFonts({
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    });
    return [fontsLoaded, fontError]
}

export { useFontsHook }