import { setLoading } from '@/redux/loadingSlice';
import { store } from '@/redux/store';
import { showErrorMessage } from '@/utils/helper';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, storage } from './config';
import { setAstrologers, setMyBookings, setUser } from '@/redux/userSlice';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { setSelectedEvent, updateSelectedEvent } from '@/redux/eventSlice';

const handleError = (error: object) => {
  console.log('Error', error);
  store.dispatch(setLoading(false));
  showErrorMessage('Somethng went wrong, Please try again');
  return false;
};

export const createUser = async (
  phoneNumber: string,
  email: string,
  fullName: string
) => {
  try {
    store.dispatch(setLoading(true));
    const table =
      store.getState().user.userType === 'user' ? 'users' : 'astrologers';
    const usersRef = collection(db, table);
    const userData: any = {
      phoneNumber,
      email,
      fullName,
      uid: auth.currentUser?.uid,
    };

    if (table === 'astrologers') {
      userData.about = '';
      userData.consults = 0;
      userData.experience = 0;
      userData.gender = '';
      userData.image = '';
      userData.language = [];
      userData.rate = 0;
      userData.ratings = 0;
      userData.skills = [];
    }

    await setDoc(doc(usersRef, auth.currentUser?.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    store.dispatch(setLoading(false));
    return true;
  } catch (e: any) {
    handleError(e);
  }
};

export const isUserExist = async (phone: string) => {
  try {
    const table =
      store.getState().user.userType === 'user' ? 'users' : 'astrologers';
    const q = query(collection(db, table), where('phoneNumber', '==', phone));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      store.dispatch(setLoading(false));
      showErrorMessage('This user does not exist');
      return false;
    } else {
      return true;
    }
  } catch (error: any) {
    handleError(error);
  }
};

export const getUser = async () => {
  try {
    const table =
      store.getState().user.userType === 'user' ? 'users' : 'astrologers';
    const usersRef = collection(db, table);
    const docRef = doc(usersRef, auth.currentUser?.uid);
    const querySnapshot = await getDoc(docRef);
    if (!querySnapshot.exists()) {
      store.dispatch(setLoading(false));
      showErrorMessage('This user does not exist');
      return false;
    } else {
      store.dispatch(setUser(querySnapshot.data()));
    }
  } catch (error: any) {
    handleError(error);
  }
};

export const getAstrologers = async () => {
  try {
    const astrologersRef = collection(db, 'astrologers');
    const querySnapshot = await getDocs(astrologersRef);
    const astrologers: any = [];
    querySnapshot.forEach(doc => {
      astrologers.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setAstrologers(astrologers));
  } catch (error: any) {
    handleError(error);
  }
};

export const getAstrologer = async (id: string) => {
  try {
    const astrologersRef = collection(db, 'astrologers');
    const docRef = doc(astrologersRef, id);
    const reviewRef = collection(docRef, 'reviews');
    const [astrologer, reviews] = await Promise.all([
      getDoc(docRef),
      getDocs(reviewRef),
    ]);
    if (!astrologer.exists()) {
      store.dispatch(setLoading(false));
      showErrorMessage('This astrologer does not exist');
      return false;
    } else {
      const reviewsData: any = [];
      reviews.forEach(doc => {
        reviewsData.push({ ...doc.data(), id: doc.id });
      });
      return {
        astrologer: { ...astrologer.data(), id: astrologer.id },
        reviews: reviewsData,
      };
    }
  } catch (error: any) {
    handleError(error);
  }
};

export const uploadImage = async (uri: string) => {
  try {
    store.dispatch(setLoading(true));
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, 'images/' + Date.now() + '.jpg');
    const snapshot = await uploadBytesResumable(storageRef, blob);
    console.log('Uploaded a blob or file!', snapshot);
    const URL = await getDownloadURL(snapshot.ref);
    console.log('URL', URL);
    return URL;
  } catch (error: any) {
    handleError(error);
  }
};

export const createBooking = async (data: any) => {
  try {
    const uploadIfNeeded = async (field: string) => {
      if (data[field]) {
        data[field] = await uploadImage(data[field]);
      }
    };

    await Promise.all([uploadIfNeeded('image'), uploadIfNeeded('kundali')]);

    store.dispatch(setLoading(true));
    const bookingRef = collection(db, 'bookings');
    const bookingData = {
      userId: auth.currentUser?.uid,
      status: 'waiting',
      createdAt: serverTimestamp(),
      ...data,
    };
    console.log('bookingData', bookingData);
    await setDoc(doc(bookingRef), bookingData);
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const getMyBookings = async () => {
  const attribute =
    store.getState().user.userType == 'user' ? 'userId' : 'astrologerId';
  try {
    const q = query(
      collection(db, 'bookings'),
      where(attribute, '==', auth.currentUser?.uid),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const bookings: any = [];
    querySnapshot.forEach(doc => {
      bookings.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setMyBookings(bookings));
  } catch (error: any) {
    handleError(error);
  }
};

export const updateBooking = async (data: any) => {
  try {
    const uploadIfNeeded = async (field: string) => {
      if (!data[field].includes('firebasestorage.googleapis.com')) {
        data[field] = await uploadImage(data[field]);
      }
    };

    await Promise.all([uploadIfNeeded('image'), uploadIfNeeded('kundali')]);

    store.dispatch(setLoading(true));
    const bookingRef = doc(db, 'bookings', data.id);
    await updateDoc(bookingRef, data);
    await getMyBookings();
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const deleteBooking = async (id: string) => {
  try {
    store.dispatch(setLoading(true));
    const bookingRef = doc(db, 'bookings', id);
    await updateDoc(bookingRef, { status: 'deleted' });
    await getMyBookings();
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const updateProfile = async (data: any) => {
  try {
    store.dispatch(setLoading(true));
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const uploadIfNeeded = async (field: string) => {
      if (!data[field].includes('firebasestorage.googleapis.com')) {
        data[field] = await uploadImage(data[field]);
      }
    };
    await uploadIfNeeded('image');
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, data);
    await getUser();
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const updateEventStatus = async (id: string, status: string) => {
  try {
    store.dispatch(setLoading(true));
    const eventRef = doc(db, 'bookings', id);
    await updateDoc(eventRef, { status });
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const getUserPhoneNumber = async (id: string) => {
  try {
    const userRef = doc(db, 'users', id);
    const querySnapshot = await getDoc(userRef);
    if (querySnapshot.exists()) {
      store.dispatch(updateSelectedEvent(querySnapshot.data().phoneNumber));
    }
    store.dispatch(setLoading(false));
  } catch (error: any) {
    handleError(error);
  }
};
