import { setLoading } from "@/redux/loadingSlice"
import { store } from "@/redux/store"
import { showErrorMessage } from "@/utils/helper"
import { collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import { auth, db } from "./config"
import { setAstrologers, setUser } from "@/redux/userSlice"

const handleError = (error: object) => {
    console.log('Error', error)
    store.dispatch(setLoading(false))
    showErrorMessage('Somethng went wrong, Please try again')
    return false
}


export const createUser = async (phoneNumber: string, email: string, fullName: string) => {
    try {
        store.dispatch(setLoading(true))
        const usersRef = collection(db, "users");
        const userData = {
            phoneNumber,
            email,
            fullName,
            uid: auth.currentUser?.uid,
        }

        await setDoc(doc(usersRef, auth.currentUser?.uid), {
            ...userData,
            createdAt: serverTimestamp(),
        });
        store.dispatch(setLoading(false))
        return true
    } catch (e: any) {
        handleError(e)
    }
}

export const isUserExist = async (phone: string) => {
    try {
        const q = query(collection(db, "users"), where("phoneNumber", "==", phone));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            store.dispatch(setLoading(false))
            showErrorMessage('This user does not exist')
            return false
        } else {
            return true
        }
    } catch (error: any) {
        handleError(error)
    }
}

export const getUser = async () => {
    try {
        const usersRef = collection(db, "users");
        const docRef = doc(usersRef, auth.currentUser?.uid);
        const querySnapshot = await getDoc(docRef);
        if (!querySnapshot.exists()) {
            store.dispatch(setLoading(false))
            showErrorMessage('This user does not exist')
            return false
        } else {
            store.dispatch(setUser(querySnapshot.data()))
        }
    } catch (error: any) {
        handleError(error)
    }
}

export const getAstrologers = async () => {
    try {
        const astrologersRef = collection(db, "astrologers");
        const querySnapshot = await getDocs(astrologersRef);
        const astrologers: any = []
        querySnapshot.forEach((doc) => {
            astrologers.push({ ...doc.data(), id: doc.id })
        });
        store.dispatch(setAstrologers(astrologers))
    } catch (error: any) {
        handleError(error)
    }
}

export const getAstrologer = async (id: string) => {
    try {
        const astrologersRef = collection(db, "astrologers");
        const docRef = doc(astrologersRef, id);
        const reviewRef = collection(docRef, 'reviews')
        const [astrologer, reviews] = await Promise.all([getDoc(docRef), getDocs(reviewRef)])
        if (!astrologer.exists()) {
            store.dispatch(setLoading(false))
            showErrorMessage('This astrologer does not exist')
            return false
        } else {
            const reviewsData: any = []
            reviews.forEach((doc) => {
                reviewsData.push({ ...doc.data(), id: doc.id })
            });
            return { astrologer: { ...astrologer.data(), id: astrologer.id }, reviews: reviewsData }
        }
    } catch (error: any) {
        handleError(error)
    }
}

export const createBooking = async (data: any) => {
    try {
        store.dispatch(setLoading(true))
        const bookingRef = collection(db, "bookings");
        const bookingData = {
            userId: auth.currentUser?.uid,
            status: 'waiting',
            createdAt: serverTimestamp(),
            ...data
        }

        await setDoc(doc(bookingRef), bookingData);
        store.dispatch(setLoading(false))
        return true
    } catch (error: any) {
        handleError(error)

    }
}

export const getMyBookings = async () => {
    try {
        const q = query(collection(db, "bookings"), where("userId", "==", auth.currentUser?.uid), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const bookings: any = []
        querySnapshot.forEach((doc) => {
            bookings.push({ ...doc.data(), id: doc.id })
        });
        return bookings
    } catch (error: any) {
        handleError(error)
    }
}
