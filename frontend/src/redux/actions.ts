import { createAction } from '@reduxjs/toolkit';
import { Song } from './types.ts';

export const ADD_SONG = 'ADD_SONG';
export const REMOVE_SONG = 'REMOVE_SONG';

export const addSong = createAction<Song>(ADD_SONG);
export const removeSong = createAction<string>(REMOVE_SONG);