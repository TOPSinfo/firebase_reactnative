import { setLoading } from '@/redux/loadingSlice';
import { store } from '@/redux/store';
import { showErrorMessage } from '@/utils/helper';
import {
  collection,
  deleteDoc,
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
import {
  setAppointmentSlots,
  setAstrologers,
  setMyBookings,
  setUser,
} from '@/redux/userSlice';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { setSelectedEvent, updateSelectedEvent } from '@/redux/eventSlice';
import { setLanguages, setSpecialities } from '@/redux/appSlice';

const handleError = (error: object) => {
  console.log('Error', error);
  store.dispatch(setLoading(false));
  showErrorMessage('Somethng went wrong, Please try again');
  return false;
};

export const createUser = async (
  phone: string,
  email: string,
  fullname: string
) => {
  try {
    store.dispatch(setLoading(true));
    const usertype = store.getState().user.userType;
    const usersRef = collection(db, 'users');
    const userData: any = {
      phone,
      email,
      fullname,
      usertype,
      walletbalance: 0,
      profileimage: '',
      uid: auth.currentUser?.uid,
      devicedetails: '',
      token: '',
      isOnline: false,
      lastupdatetime: serverTimestamp(),
      createdat: serverTimestamp(),
    };

    if (usertype === 'astrologer') {
      userData.aboutyou = '';
      userData.consults = 0;
      userData.experience = 0;
      userData.languages = [];
      userData.price = 0;
      userData.rating = 0;
      userData.speciality = [];
    } else {
      userData.birthdate = '';
      userData.birthplace = '';
      userData.birthtime = '';
    }

    await setDoc(doc(usersRef, auth.currentUser?.uid), userData);
    store.dispatch(setLoading(false));
    return true;
  } catch (e: any) {
    handleError(e);
  }
};

export const isUserExist = async (phone: string) => {
  try {
    const q = query(
      collection(db, 'users'),
      where('phone', '==', phone),
      where('usertype', '==', store.getState().user.userType)
    );
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
    const usersRef = collection(db, 'users');
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
    const astrologersRef = query(
      collection(db, 'users'),
      where('usertype', '==', 'astrologer')
    );
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
    const astrologersRef = collection(db, 'users');
    const docRef = doc(astrologersRef, id);
    const reviewRef = collection(docRef, 'rating');
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
    store.dispatch(setLoading(true));
    const uploadIfNeeded = async (field: string) => {
      if (data[field]) {
        data[field] = await uploadImage(data[field]);
      }
    };

    await Promise.all([uploadIfNeeded('photo'), uploadIfNeeded('kundali')]);
    const bookingRef = doc(collection(db, 'bookinghistory'));
    const bookingData = {
      uid: auth.currentUser?.uid,
      status: 'approved',
      allowextend: 'no',
      extendtime: 0,
      createdat: serverTimestamp(),
      bookingid: bookingRef.id,
      ...data,
    };
    console.log('bookingData', bookingData);
    await setDoc(bookingRef, bookingData);
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const getMyBookings = async () => {
  const attribute =
    store.getState().user.userType == 'user' ? 'uid' : 'astrologerid';
  try {
    const q = query(
      collection(db, 'bookinghistory'),
      where(attribute, '==', auth.currentUser?.uid),
      orderBy('createdat', 'desc')
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

    await Promise.all([uploadIfNeeded('photo'), uploadIfNeeded('kundali')]);

    store.dispatch(setLoading(true));
    const bookingRef = doc(db, 'bookinghistory', data.id);
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
    const bookingRef = doc(db, 'bookinghistory', id);
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
      if (
        data[field] &&
        !data[field].includes('firebasestorage.googleapis.com')
      ) {
        data[field] = await uploadImage(data[field]);
      }
    };
    await uploadIfNeeded('profileimage');
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      lastupdatetime: serverTimestamp(),
    });
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
    const eventRef = doc(db, 'bookinghistory', id);
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
      store.dispatch(updateSelectedEvent(querySnapshot.data().phone));
    }
    store.dispatch(setLoading(false));
  } catch (error: any) {
    handleError(error);
  }
};

export const getLanguagesAndSpecialities = async () => {
  try {
    const languagesRef = collection(db, 'language');
    const specialitiesRef = collection(db, 'speciality');
    const [languages, specialities] = await Promise.all([
      getDocs(languagesRef),
      getDocs(specialitiesRef),
    ]);
    const languagesData: any = [];
    const specialitiesData: any = [];
    languages.forEach(doc => {
      languagesData.push({ ...doc.data() });
    });
    specialities.forEach(doc => {
      specialitiesData.push({ ...doc.data() });
    });
    store.dispatch(setLanguages(languagesData));
    store.dispatch(setSpecialities(specialitiesData));
  } catch (error: any) {
    handleError(error);
  }
};

export const saveAppointmentSlot = async (data: any) => {
  try {
    store.dispatch(setLoading(true));
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const appointmentSlotRef = doc(collection(db, 'users', uid, 'timeslot'));
    if (data.timeslotid) {
      const timeslotRef = doc(db, 'users', uid, 'timeslot', data.timeslotid);
      await updateDoc(timeslotRef, {
        ...data,
      });
    } else {
      await setDoc(appointmentSlotRef, {
        ...data,
        createdat: serverTimestamp(),
        uid,
        timeslotid: appointmentSlotRef.id,
      });
    }
    store.dispatch(setLoading(false));
    await getAppointmentSlots();
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const getAppointmentSlots = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const q = query(collection(db, 'users', uid, 'timeslot'));
    const querySnapshot = await getDocs(q);
    const appointmentSlots: any = [];
    querySnapshot.forEach(doc => {
      appointmentSlots.push({ ...doc.data() });
    });
    store.dispatch(setAppointmentSlots(appointmentSlots));
  } catch (error: any) {
    handleError(error);
  }
};

export const deleteAppointmentSlot = async (id: string) => {
  try {
    store.dispatch(setLoading(true));
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const appointmentSlotRef = doc(db, 'users', uid, 'timeslot', id);
    await deleteDoc(appointmentSlotRef);
    await getAppointmentSlots();
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};
