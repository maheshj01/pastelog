import { AuthService } from "@/app/(main)/_services/AuthService";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User as FirebaseUser } from 'firebase/auth';


interface AuthState {
    user: FirebaseUser | null,
    loading: boolean;
    isFirstLogin: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    isFirstLogin: true,
    error: null,
};

const authService = new AuthService();

// Async thunk for signing in with Google
export const signInWithGoogle = createAsyncThunk(
    'auth/signInWithGoogle',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.signInWithGoogle();
            return user;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }
);

// Async thunk for signing out
export const signOut = createAsyncThunk(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        try {
            await authService.signOut();
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }
);

// Async thunk for checking if it's the first time login
export const isFirstTimeLogin = createAsyncThunk(
    'auth/isFirstTimeLogin',
    async (userId: string, { rejectWithValue }) => {
        try {
            const firstLogin = await authService.isFirstTimeLogin(userId);
            return firstLogin;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : "An unknown error occurred");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<FirebaseUser | null>) => {
            state.user = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setIsFirstLogin: (state, action: PayloadAction<boolean>) => {
            state.isFirstLogin = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signInWithGoogle.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signInWithGoogle.fulfilled, (state: AuthState, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(signInWithGoogle.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(signOut.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signOut.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
            })
            .addCase(signOut.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(isFirstTimeLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(isFirstTimeLogin.fulfilled, (state, action) => {
                state.isFirstLogin = action.payload;
                state.loading = false;
            })
            .addCase(isFirstTimeLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setUser, setLoading, setError, setIsFirstLogin } = authSlice.actions;
export default authSlice.reducer;