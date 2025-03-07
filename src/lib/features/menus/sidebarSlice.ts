import { AuthService } from "@/app/(main)/_services/AuthService";
import LogService from "@/app/(main)/_services/logService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
    id: string | null;
    selected: any;
    showSideBar: boolean;
    logs: any[];
    loading: boolean;
    navbarTitle: string;
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

export const fetchLogs = createAsyncThunk(
    'sidebar/fetchLogs',
    async (userId: string, { dispatch }) => {
        await logService.deleteExpiredLogs();
        if (userId) {
            const isFirstLogin = await authService.isFirstTimeLogin(userId);
            if (isFirstLogin) {
                const logs = await logService.fetchLogsFromLocal();
                dispatch(setLogs(logs));
            }
            return await logService.getLogsByUserId(userId);
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
        }
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