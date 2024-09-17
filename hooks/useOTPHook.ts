import React from 'react'
import { useFirebaseLogin } from '@itzsunny/firebase-login'
import { auth, firebaseConfig } from '../services/config'
import { useDispatch } from 'react-redux'
import { setLoading } from '../redux/loadingSlice'
import { showErrorMessage } from '@/utils/helper'


const useOTP = () => {
    const { recaptcha, recaptchaBanner, sendOtp, verifyOtp } = useFirebaseLogin({ auth: auth, firebaseConfig: firebaseConfig, modalOption: { attemptInvisibleVerification: true } })
    const dispatch = useDispatch()
    const sendOTP = async (phoneNumber: string) => {
        try {
            return await sendOtp(phoneNumber)
        } catch (error: any) {
            dispatch(setLoading(false))
            showErrorMessage(error.message)
        }
    }

    const verifyOTP = async (verificationId: string, code: string) => {
        try {
            return await verifyOtp(verificationId, code)
        } catch (error: any) {
            dispatch(setLoading(false))
            showErrorMessage(error.message)
        }
    }

    return { recaptcha, recaptchaBanner, sendOTP, verifyOTP }
}

export { useOTP }