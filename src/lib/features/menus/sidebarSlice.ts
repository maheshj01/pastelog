import { AuthService } from "@/app/(main)/_services/AuthService";
import LogService from "@/app/(main)/_services/logService";
import { LogType } from "@/app/constants";
import { timestampToISOString } from "@/utils/utils";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Timestamp } from "firebase/firestore";

interface SidebarState {
    id: string | null;
    selected: any;
    showSideBar: boolean;
    logs: any[];
    loading: boolean;
    navbarTitle: string;
}

export interface Note {
    id: string;
    title: string;
    data: string;
    createdAt: string;
    updatedAt: string;
    expiryDate: string;
    type: LogType;
    createdDate: Timestamp;
    lastUpdatedAt: Timestamp;
    isExpired: boolean,
    summary: string
    isPublic: false,
    userId: string,
    isMarkDown: boolean,
}

const initialState: SidebarState = {
    id: null,
    selected: null,
    showSideBar: true,
    logs: [],
    loading: false,
    navbarTitle: ''
};

const logService = new LogService();
const authService = new AuthService();

export function parseLog(log: any) {
    return {
        ...log,
        createdDate: timestampToISOString(log.createdDate),
        lastUpdatedAt: timestampToISOString(log.lastUpdatedAt),
        expiryDate: timestampToISOString(log.expiryDate),
    };
}

export const fetchLogs = createAsyncThunk(
    'sidebar/fetchLogs',
    async (userId: string, { dispatch }) => {
        if (userId) {
            const isFirstLogin = await authService.isFirstTimeLogin(userId);
            if (isFirstLogin) {
                const logs = await logService.fetchLogsFromLocal();
                dispatch(setLogs(logs.map(parseLog)));
            }
            const remoteLogs = await logService.getLogsByUserId(userId);
            return remoteLogs.map(parseLog);
        }
        return await logService.fetchLogsFromLocal();
    }
);

export const fetchLogsFromLocal = createAsyncThunk(
    'sidebar/fetchLogsFromLocal',
    async () => {
        return await logService.fetchLogsFromLocal();
    }
);

const sidebarSlice = createSlice({
    name: 'sidebarSlice',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setSelected: (state, action: PayloadAction<any | null>) => {
            state.selected = action.payload;
        },
        setId: (state, action: PayloadAction<string | null>) => {
            state.id = action.payload;
        },
        setShowSideBar: (state, action: PayloadAction<boolean>) => {
            state.showSideBar = action.payload;
        },
        toggleSideBar: (state) => {
            state.showSideBar = !state.showSideBar;
        },
        setNavbarTitle: (state, action: PayloadAction<string>) => {
            state.navbarTitle = action.payload;
        },
        refreshLogs: (state) => {
            // This will trigger a re-fetch through the component
        },
        setLogs(state, action) {
            state.logs = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload;
            })
            .addCase(fetchLogs.rejected, (state) => {
                state.loading = false;
            })
    }
});

export const { setSelected, setId, setShowSideBar, toggleSideBar, setLoading, setNavbarTitle, refreshLogs, setLogs } = sidebarSlice.actions;

export default sidebarSlice.reducer;