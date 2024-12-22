"use client";

import { fetchMenuItems } from '@/lib/features/menus/menuSlice';
import { AppDispatch, store } from '@/lib/store';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import AppLayout from './app_layout';

export default function LogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AppLayout>
                {children}
            </AppLayout>
        </Provider>
    );
}
