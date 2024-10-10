import { configureStore } from '@reduxjs/toolkit'
import reducers, { RootState } from './reducers'
import logger from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user', 'create_or_enter_league'],
    version: 1,
    stateReconciler: autoMergeLevel2,
    migrate: (state: any) => {
        // console.log('Migration Running!')
        return Promise.resolve(state)
    }
}

const persistedReducer = persistReducer<RootState>(persistConfig, reducers)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }).concat(logger)
})

const persistor = persistStore(store)

export { store, persistor }
