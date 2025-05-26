
import { create } from 'zustand';

export interface Note {
    id?: number;
    title: string;
    description: string;
    content?: string;
    created_at?: string;
    updated_at?: string;
}


export interface NoteState {
    notes: Note[]
    currentNote: Note | null,
    setCurrentNote: (note: Note | null) => void,
    setNotes: (notes: Note[]) => void,
}

export const useNoteStore = create<NoteState>((set) => ({
    notes: [], 
    currentNote: null,
    setCurrentNote: (note: Note | null) => set({ currentNote: note }),
    setNotes: (notes: Note[]) => set({ notes }),
}))