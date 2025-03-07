"use clent  ";
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './features/menus/authSlice';
import editorSlice from './features/menus/editorSlice';
import menuReducer from './features/menus/menuSlice';
import sidebarSlice from './features/menus/sidebarSlice';

export const store = configureStore({
    reducer: {
        menu: menuReducer,
        sidebar: sidebarSlice,
        auth: authSlice,
        editor: editorSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;