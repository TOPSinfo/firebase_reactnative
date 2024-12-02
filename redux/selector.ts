import { useSelector } from 'react-redux';

export const loadingSelector = () => {
  return useSelector((state: any) => state.loading.isLoading);
};

export const userSelector = () => {
  return useSelector((state: any) => state.user.userData);
};

export const astrologersSelector = () => {
  return useSelector((state: any) => state.user.astrologers);
};

export const myBookingsSelector = () => {
  return useSelector((state: any) => state.user.myBookings);
};

export const selectedEventSelector = () => {
  return useSelector((state: any) => state.event.selectedEvent);
};

export const userTypeSelector = () => {
  return useSelector((state: any) => state.user.userType);
};

export const languageListSelector = () => {
  return useSelector((state: any) => state.app.languages);
};

export const specialityListSelector = () => {
  return useSelector((state: any) => state.app.specialities);
};

export const selectedSlotSelector = () => {
  return useSelector((state: any) => state.user.selectedSlot);
};

export const apponitmentSlotSelector = () => {
  return useSelector((state: any) => state.user.appointmentSlots);
};

export const transactionHistorySelector = () => {
  return useSelector((state: any) => state.user.transactionHistory);
};
