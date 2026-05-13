import { configureStore } from '@reduxjs/toolkit';
import { setStoreReference } from '../utils/AxiosInterceptor';
import AuthReducer from './slices/AuthSlice';
import OtherReducer from './slices/OtherSlice';
import ThemeReducer from './slices/ThemeSlice';

export const store = configureStore({
    reducer: {
        other: OtherReducer,
        auth: AuthReducer,
        theme: ThemeReducer,
    },
});

// Set store reference for AxiosInterceptor to avoid circular dependency
setStoreReference(() => store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;