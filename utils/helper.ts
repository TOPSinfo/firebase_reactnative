import { Colors } from "@/constants/Colors"
import { StatusBar } from "react-native"
import { showMessage } from "react-native-flash-message"

export const showSuccessMessage = (message: string, title = "Success") => {
    showMessage({
        message: title,
        description: message,
        type: 'success',
        duration: 2500,
        statusBarHeight: StatusBar.currentHeight
    })
}

import { MessageType } from "react-native-flash-message"

export const showErrorMessage = (message: string) => {
    showMessage({
        message: "Oops!",
        description: message,
        type: 'error' as MessageType,
        duration: 2500,
        backgroundColor: Colors.red,
        statusBarHeight: StatusBar.currentHeight
    })
}

export const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}