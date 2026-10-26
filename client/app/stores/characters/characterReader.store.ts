// -Path: 'client/app/stores/characters/characterReader.store.ts'
import { create } from 'zustand';

/** The live reading state of a character chart. */
export interface CharacterReaderState {
    /** Whether a walk is speaking right now. */
    isReading: boolean;
    /** The character the walk is on, or null when it is idle. */
    readingChar: string | null;
    /** Starts or ends a walk without touching the current character. */
    setReading: (isReading: boolean) => void;
    /** Marks the character the walk is on. */
    setReadingChar: (readingChar: string | null) => void;
    /** Ends the walk and clears its character. */
    resetReading: () => void;
}

/**
 * The reading state, shared by every component of a chart. The toolbar, the
 * grid and the stats each call `useCharacterToolbar`, so the state has to live
 * outside a single component: a walk started in the toolbar must reach the
 * grid that highlights it. Never persisted — a reload starts idle.
 */
export const useCharacterReaderStore = create<CharacterReaderState>()((set) => ({
    isReading: false,
    readingChar: null,
    setReading: (isReading) => set({ isReading }),
    setReadingChar: (readingChar) => set({ readingChar }),
    resetReading: () => set({ isReading: false, readingChar: null }),
}));
