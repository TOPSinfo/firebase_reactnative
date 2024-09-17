import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers'
import logger from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user', 'create_or_enter_league']
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(logger)
})

const persistor = persistStore(store)

export { store, persistor }
