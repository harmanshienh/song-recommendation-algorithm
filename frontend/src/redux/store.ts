import { configureStore, Store } from '@reduxjs/toolkit';
import songsReducer from "./reducer";

export const store: Store = configureStore({
    reducer: {
        songs: songsReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;