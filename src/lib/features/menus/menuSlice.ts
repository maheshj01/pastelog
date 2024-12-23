import FeatureService from '@/app/(main)/_services/feature';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface MenuState {
    menuItems: {
        releaseNotes: boolean;
        github: boolean;
        report: boolean;
        tour: boolean;
    };
    loading: boolean;
    error: string | null;
}

const initialState: MenuState = {
    menuItems: {
        releaseNotes: true,
        github: true,
        report: true,
        tour: true,
    },
    loading: false,
    error: null,
};

// Async thunk to fetch menu items
export const fetchMenuItems = createAsyncThunk('menu/fetchMenuItems', async () => {
    const featureService = new FeatureService();
    const data = await featureService.menuDoc();
    return data;
});

const menuSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMenuItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMenuItems.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.menuItems = action.payload;
            })
            .addCase(fetchMenuItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch menu items';
            });
    },
});

export default menuSlice.reducer;
