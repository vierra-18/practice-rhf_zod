import { useState, useEffect } from "react";
import { Note } from "@/types/types";

const useNotes = () => {
	const [notes, setNotes] = useState<Note[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedNotes = localStorage.getItem("notes");
			if (storedNotes) {
				setNotes(JSON.parse(storedNotes));
			}
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		if (typeof window !== "undefined" && !isLoading) {
			localStorage.setItem("notes", JSON.stringify(notes));
		}
	}, [notes, isLoading]);

	const addNote = (
		title: string,
		text: string,
		important?: boolean,
		noteColor?: string
	) => {
		const newNote: Note = {
			id: Date.now().toString(),
			title,
			text,
			important: important || false,
			noteColor: noteColor || "#4B6DDE",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
		setNotes((prevNotes) => [...prevNotes, newNote]);
	};

	const editNote = (
		id: string,
		title: string,
		text: string,
		important?: boolean,
		noteColor?: string
	) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id
					? {
							...note,
							title,
							text,
							important: important || false,
							noteColor: noteColor || "#4B6DDE",
							updatedAt: new Date().toISOString(),
					  }
					: note
			)
		);
	};

	const toggleNoteCompletion = (id: string) => {
		setNotes((prevNotes) =>
			prevNotes.map((note) =>
				note.id === id
					? {
							...note,
							completed: !note.completed,
							updatedAt: new Date().toISOString(),
					  }
					: note
			)
		);
	};

	const deleteNote = (id: string) => {
		setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
	};

	return {
		notes,
		addNote,
		editNote, // Expose editNote function
		toggleNoteCompletion,
		deleteNote,
		isLoading,
	};
};

export default useNotes;
