import { setLoading } from '@/redux/loadingSlice';
import { store } from '@/redux/store';
import {
  getChatId,
  sendPushNotification,
  showErrorMessage,
} from '@/utils/helper';
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
  increment,
  onSnapshot,
  addDoc,
  writeBatch,
  limit,
  startAfter,
} from 'firebase/firestore';
import { auth, db, storage } from './config';
import {
  setAppointmentSlots,
  setAstrologers,
  setLastVisibleMessage,
  setLoadMoreMessages,
  setMessages,
  setMyBookings,
  setTransactionHistory,
  setUser,
  updateMessages,
} from '@/redux/userSlice';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { onChangeEventData, updateSelectedEvent } from '@/redux/eventSlice';
import { setLanguages, setSpecialities } from '@/redux/appSlice';
import moment from 'moment';

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

export const checkDateAndTimeSlot = async (data: any) => {
  try {
    const conditions = [
      where('astrologerid', '==', data.astrologerid),
      where('date', '==', data.date),
    ];
    if (data.bookingid) {
      conditions.push(where('bookingid', '!=', data.bookingid));
    }
    const q = query(collection(db, 'bookinghistory'), ...conditions);
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const newStartTime = moment(data.starttime, 'hh:mm A');
      const newEndTime = moment(data.endtime, 'hh:mm A');

      let slotAvailable = true;
      querySnapshot.forEach(doc => {
        const event = doc.data();
        const existingStartTime = moment(event.starttime, 'hh:mm A');
        const existingEndTime = moment(event.endtime, 'hh:mm A');
        if (
          newStartTime.isBetween(
            existingStartTime,
            existingEndTime,
            undefined,
            '[)'
          ) || // Starts within existing range
          newEndTime.isBetween(
            existingStartTime,
            existingEndTime,
            undefined,
            '(]'
          ) || // Ends within existing range
          existingStartTime.isBetween(newStartTime, newEndTime, undefined, '[)') // Existing range is fully inside new range
        ) {
          slotAvailable = false;
        }
      });
      if (slotAvailable) {
        store.dispatch(onChangeEventData({ slotAvailable: true }));
      } else {
        showErrorMessage(
          'This time slot is already booked, Please select another date or time'
        );
        store.dispatch(onChangeEventData({ slotAvailable: false }));
      }
    } else {
      store.dispatch(onChangeEventData({ slotAvailable: true }));
    }
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
    addTransaction(bookingData);
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const deductWalletBalance = async (amount: number) => {
  try {
    store.dispatch(setLoading(true));
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { walletbalance: increment(-amount) });
    await getUser();
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const topupWallet = async (data: any) => {
  try {
    store.dispatch(setLoading(true));
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { walletbalance: increment(data.amount) });
    await getUser();
    addTransaction(data);
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

export const updateDeviceToken = async (token: string) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { token });
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

export const addTransaction = async (data: any) => {
  try {
    store.dispatch(setLoading(true));
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const transactionRef = doc(
      collection(db, 'users', uid, 'transactionhistory')
    );
    await setDoc(transactionRef, {
      amount: data.amount,
      astrologerid: data.astrologerid || '',
      astrologername: data.astrologername || '',
      bookingid: data.bookingid || '',
      description: '',
      paymenttype: data.paymenttype,
      transactionid: data.transactionid,
      username: data.username,
      transactiontype: data.bookingid ? 'debit' : 'credit',
      createdat: serverTimestamp(),
      setcapturedgateway: false,
      orderid: transactionRef.id,
      uid,
    });
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const getTransactionHistory = async () => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    store.dispatch(setLoading(true));
    const q = query(collection(db, 'users', uid, 'transactionhistory'));
    const querySnapshot = await getDocs(q);
    const transactions: any = [];
    querySnapshot.forEach(doc => {
      transactions.push({ ...doc.data(), id: doc.id });
    });
    store.dispatch(setTransactionHistory(transactions));
    store.dispatch(setLoading(false));
  } catch (error: any) {
    handleError(error);
  }
};

export const sendMessage = async (
  data: any,
  senderName: string,
  bookingid: string
) => {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('User is not authenticated');
    }
    const messageid = getChatId(data.senderid, data.receiverid);

    const messageRef = collection(db, 'messages', messageid, 'message');

    const uploadIfNeeded = async (field: string) => {
      if (data[field]) {
        data[field] = await uploadImage(data[field]);
        store.dispatch(setLoading(false));
      }
    };
    await uploadIfNeeded('url');

    await addDoc(messageRef, {
      ...data,
      timestamp: serverTimestamp(),
    });
    const receiverDoc = doc(db, 'users', data.receiverid);
    const receiver = await getDoc(receiverDoc);
    if (receiver.exists()) {
      const receiverData = receiver.data();
      if (receiverData?.token) {
        await sendPushNotification(
          `Message from ${senderName}`,
          data.messagetype == 'IMAGE' ? '📷 Photo' : data.messagetext,
          receiverData.token,
          bookingid,
          'chat'
        );
      }
    }
  } catch (error: any) {
    handleError(error);
  }
};

export const getMoreMessages = async (data: any) => {
  if (!store.getState().user.lastVisibleMessage) return false;
  try {
    const messageid = getChatId(data.senderid, data.receiverid);
    const q = query(
      collection(db, `messages/${messageid}/message`),
      orderBy('timestamp', 'desc'),
      startAfter(store.getState().user.lastVisibleMessage),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const messages: any = [];
      const unReadMessages: any = [];
      store.dispatch(
        setLastVisibleMessage(querySnapshot.docs[querySnapshot.docs.length - 1])
      );
      querySnapshot.forEach(doc => {
        const msgData = doc.data();
        let message = {
          _id: doc.id,
          text: msgData.messagetext,
          createdAt: msgData.timestamp?.seconds
            ? new Date(msgData.timestamp.seconds * 1000)
            : new Date(),
          user: {
            _id: msgData.senderid,
          },
          image: msgData.url,
          // You can also add a video prop:
          video: msgData.video_url,
          // Mark the message as sent, using one tick
          sent: msgData.status === 'SEND',
          received: msgData.status === 'READ',
          type: msgData.type,
        };
        if (msgData.receiverid == data.senderid && msgData.status === 'SEND') {
          unReadMessages.push(doc.id);
        }
        messages.push(message);
      });
      if (messages.length > 0) {
        store.dispatch(setLoadMoreMessages(messages));
      }
      if (unReadMessages.length > 0) {
        const batch = writeBatch(db);
        unReadMessages.forEach((messageId: any) => {
          const messageRef = doc(
            db,
            'messages',
            messageid,
            'message',
            messageId
          );
          batch.update(messageRef, { status: 'READ' });
        });
        await batch.commit();
      }
    }
    return !querySnapshot.empty;
  } catch (error: any) {
    handleError(error);
  }
};

export const getMessageSnapshot = (data: any) => {
  try {
    const messageid = getChatId(data.senderid, data.receiverid);
    const q = query(
      collection(db, `messages/${messageid}/message`),
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    const subscribe = onSnapshot(q, async querySnapshot => {
      if (!querySnapshot.empty) {
        const messages: any = [];
        const unReadMessages: any = [];
        store.dispatch(
          setLastVisibleMessage(
            querySnapshot.docs[querySnapshot.docs.length - 1]
          )
        );
        const messagesList = querySnapshot
          .docChanges()
          .map(change => {
            if (change.type === 'added' || change.type === 'modified') {
              return {
                id: change.doc.id,
                type: change.type,
                ...change.doc.data(),
              };
            }
            return null;
          })
          .filter(message => message !== null);
        messagesList.forEach(async (doc: any) => {
          const msgData = doc;
          let message = {
            _id: msgData.id,
            text: msgData.messagetext,
            createdAt: msgData.timestamp?.seconds
              ? new Date(msgData.timestamp.seconds * 1000)
              : new Date(),
            user: {
              _id: msgData.senderid,
            },
            image: msgData.url,
            // You can also add a video prop:
            video: msgData.video_url,
            // Mark the message as sent, using one tick
            sent: msgData.status === 'SEND',
            received: msgData.status === 'READ',
            type: msgData.type,
          };
          if (
            msgData.receiverid == data.senderid &&
            msgData.status === 'SEND'
          ) {
            unReadMessages.push(doc.id);
          }
          messages.push(message);
        });
        console.log('Messages', messages);
        if (messages.filter((msg: any) => msg.type == 'added').length > 0) {
          store.dispatch(
            setMessages(messages.filter((msg: any) => msg.type == 'added'))
          );
        }
        if (messages.filter((msg: any) => msg.type == 'modified').length > 0) {
          store.dispatch(
            updateMessages(
              messages.filter((msg: any) => msg.type == 'modified')
            )
          );
        }
        console.log('Unread Messages', unReadMessages);
        if (unReadMessages.length > 0) {
          const batch = writeBatch(db);
          unReadMessages.forEach((messageId: any) => {
            const messageRef = doc(
              db,
              'messages',
              messageid,
              'message',
              messageId
            );
            batch.update(messageRef, { status: 'READ' });
          });
          await batch.commit();
        }
      }
    });
    return subscribe;
  } catch (error: any) {
    handleError(error);
  }
};

export const endChat = async (bookingid: any) => {
  try {
    store.dispatch(setLoading(true));
    const bookingRef = doc(db, 'bookinghistory', bookingid);
    await updateDoc(bookingRef, { status: 'completed' });
    await getMyBookings();
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};

export const getBookingDetails = async (bookingid: string) => {
  try {
    store.dispatch(setLoading(true));
    const bookingRef = doc(db, 'bookinghistory', bookingid);
    const querySnapshot = await getDoc(bookingRef);
    store.dispatch(setLoading(false));
    if (querySnapshot.exists()) {
      return querySnapshot.data();
    }
    return null;
  } catch (error: any) {
    handleError(error);
  }
};

export const createCallLog = async (data: any, bookingId: string) => {
  try {
    store.dispatch(setLoading(true));
    const callLogRef = doc(
      collection(db, 'bookinghistory', bookingId, 'calllog')
    );
    await setDoc(callLogRef, {
      ...data,
      id: callLogRef.id,
      extendcount: 0,
      extendmin: 0,
      starttime: serverTimestamp(),
      endtime: null,
      createdat: serverTimestamp(),
      status: 'active',
    });
    store.dispatch(setLoading(false));
    return callLogRef.id;
  } catch (error: any) {
    handleError(error);
  }
};

export const findActiveCallLog = async (bookingId: string) => {
  try {
    const q = query(
      collection(db, 'bookinghistory', bookingId, 'calllog'),
      where('status', '==', 'active')
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return data.id;
    }
    return null;
  } catch (error: any) {
    handleError(error);
  }
};

export const updateCallLog = async (logId: string, bookingId: string) => {
  try {
    store.dispatch(setLoading(true));
    const callLogRef = doc(db, 'bookinghistory', bookingId, 'calllog', logId);

    const callLog = await getDoc(callLogRef);
    if (callLog.exists() && callLog.data().status === 'completed') {
      store.dispatch(setLoading(false));
      return false;
    }
    await updateDoc(callLogRef, {
      endtime: serverTimestamp(),
      status: 'completed',
    });
    store.dispatch(setLoading(false));
    return true;
  } catch (error: any) {
    handleError(error);
  }
};
