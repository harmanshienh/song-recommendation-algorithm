import { createReducer, PayloadAction } from "@reduxjs/toolkit";
import { addSong, removeSong } from "./actions";
import { Song } from './types';

interface SongsState {
    songs: Song[];
}

const initialState: SongsState = {
    songs: []
}

const songsReducer = createReducer(initialState, (builder) => {
    builder
    .addCase(addSong, (state, action: PayloadAction<Song>) => {
        state.songs.push(action.payload);
    })
    .addCase(removeSong, (state, action: PayloadAction<string>) => {
        state.songs = state.songs.filter((song) => song.id !== action.payload);
    });
})

export default songsReducer;