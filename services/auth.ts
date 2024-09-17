import { ApplicationVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./config";


/**
 * Sign up a user with a phone number and verifier.
 * 
 * @param {string} phone - The phone number of the user.
 * @param {string} verifier - The verifier for the phone number.
 * @returns {Promise<any>} - A promise that resolves with the result of the sign up operation.
 */
export const signUp = async (phone: string, verifier: ApplicationVerifier): Promise<any> => {
    try {
        const result = await signInWithPhoneNumber(auth, phone, verifier);
        return result;
    } catch (error) {
        console.log('Error signing up:', error);
        return false;
    }
}