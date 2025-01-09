import {
  ApplicationVerifier,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  updatePhoneNumber,
} from 'firebase/auth';
import { auth } from './config';
import { store } from '@/redux/store';
import { setLoading } from '@/redux/loadingSlice';
import { showErrorMessage } from '@/utils/helper';

/**
 * Sign up a user with a phone number and verifier.
 *
 * @param {string} phone - The phone number of the user.
 * @param {string} verifier - The verifier for the phone number.
 * @returns {Promise<any>} - A promise that resolves with the result of the sign up operation.
 */
export const signUp = async (
  phone: string,
  verifier: ApplicationVerifier
): Promise<any> => {
  try {
    const result = await signInWithPhoneNumber(auth, phone, verifier);
    return result;
  } catch (error) {
    console.log('Error signing up:', error);
    return false;
  }
};

/**
 * Updates the phone number of the currently authenticated user.
 *
 * @param {any} verificationId - The verification ID received from the phone authentication process.
 * @param {string} code - The verification code received from the phone authentication process.
 * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the phone number was successfully updated, or `false` if an error occurred.
 *
 * @throws {Error} - Throws an error if there is no authenticated user.
 *
 * @example
 * ```typescript
 * const success = await updateUserPhone(verificationId, code);
 * if (success) {
 *   console.log('Phone number updated successfully');
 * } else {
 *   console.log('Failed to update phone number');
 * }
 * ```
 */
export const updateUserPhone = async (
  verificationId: string,
  code: string
): Promise<boolean> => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    if (auth.currentUser) {
      await updatePhoneNumber(auth.currentUser, credential);
    } else {
      throw new Error('No authenticated user found');
    }
    return true;
  } catch (error: any) {
    store.dispatch(setLoading(false));
    console.log('Phone Update Error', error);
    if (error.code == 'auth/invalid-verification-code') {
      showErrorMessage('Invalid verification code');
    } else if (error.code == 'auth/account-exists-with-different-credential') {
      showErrorMessage('Phone number already in use');
    } else {
      showErrorMessage(error.message);
    }
    return false;
  }
};
