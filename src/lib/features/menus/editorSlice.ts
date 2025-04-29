import DateUtils from "@/utils/DateUtils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditorState {
    content: string;
    title: string;
    preview: boolean;
    publishing: boolean;
    expiryDate: string | null;
    importLoading: boolean;
}

const initialState: EditorState = {
    title: "",
    content: "",
    preview: false,
    publishing: false,
    expiryDate: DateUtils.getDateOffsetBy(30),
    importLoading: false,
};

const editorSlice = createSlice({
    name: "editor",
    initialState,
    reducers: {
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload;
        },
        setContent: (state, action: PayloadAction<string>) => {
            state.content = action.payload;
        },
        setPreview: (state, action: PayloadAction<boolean>) => {
            state.preview = action.payload;
        },
        togglePreview: (state) => {
            state.preview = !state.preview;
        },
        setPublishing: (state, action: PayloadAction<boolean>) => {
            state.publishing = action.payload;
        },
        setExpiryDate: (state, action: PayloadAction<string | null>) => {
            state.expiryDate = action.payload;
        },
        setImportLoading: (state, action: PayloadAction<boolean>) => {
            state.importLoading = action.payload;
        },
        resetState: () => initialState,
    },
});

export const {
    resetState,
    setTitle,
    setContent,
    setPreview,
    togglePreview,
    setPublishing,
    setExpiryDate,
    setImportLoading,
} = editorSlice.actions;

export default editorSlice.reducer;
