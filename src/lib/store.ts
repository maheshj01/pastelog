"use clent  ";
import { configureStore } from '@reduxjs/toolkit';
import menuReducer from './features/menus/menuSlice';
import sidebarSlice from './features/menus/sidebarSlice';
import authSlice from './features/menus/authSlice';

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        sidebar: sidebarSlice,
        auth: authSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;