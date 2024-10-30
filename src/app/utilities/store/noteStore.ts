// src/app/store/noteStore.ts
import { create } from "zustand";
import { Note } from "../lib/types/types";

interface NoteState {
	notes: Note[];
	isLoading: boolean;
	addNote: (
		title: string,
		text: string,
		important?: boolean,
		noteColor?: string
	) => void;
	editNote: (id: string, updatedData: Partial<Note>) => void;
	deleteNote: (id: string) => void;
	toggleImportant: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
	notes: [],
	isLoading: false,

	addNote: (title, text, important = false, noteColor = "#ffffff") => {
		const newNote: Note = {
			id: Date.now().toString(),
			title,
			text,
			important,
			noteColor,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		set((state) => ({
			notes: [...state.notes, newNote],
			isLoading: false,
		}));
	},

	editNote: (id, updatedData) => {
		set((state) => ({
			notes: state.notes.map((note) =>
				note.id === id
					? { ...note, ...updatedData, updatedAt: new Date().toISOString() }
					: note
			),
		}));
	},

	deleteNote: (id) => {
		set((state) => ({
			notes: state.notes.filter((note) => note.id !== id),
		}));
	},

	toggleImportant: (id) => {
		set((state) => ({
			notes: state.notes.map((note) =>
				note.id === id ? { ...note, important: !note.important } : note
			),
		}));
	},
}));
