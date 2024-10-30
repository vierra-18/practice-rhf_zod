"use client";

import React, { useState } from "react";
import useNotes from "../utilities/hooks/useNotes";
import NoteForm from "./NoteForm";
import NoteItems from "./NoteItems";
const NoteList: React.FC = () => {
	const {
		notes,
		addNote,
		editNote,
		toggleNoteCompletion,
		deleteNote,
		isLoading,
	} = useNotes();

	// Initialize editingNote as undefined instead of null
	const [editingNote, setEditingNote] = useState<
		{ id: string; title: string; text: string; important?: boolean } | undefined
	>(undefined);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleEditNote = (note: {
		id: string;
		title: string;
		text: string;
		important?: boolean;
	}) => {
		setEditingNote(note); // Set the note to be edited
	};

	const handleUpdateNote = (
		id: string,
		title: string,
		text: string,
		important?: boolean
	) => {
		editNote(id, title, text, important);
		setEditingNote(undefined); // Clear edit mode after updating
	};

	return (
		<div>
			<h1>Note List</h1>
			<NoteForm
				onAddNote={addNote}
				onEditNote={handleUpdateNote}
				editingNote={editingNote} // Pass editingNote as undefined or note object
			/>
			<NoteItems
				notes={notes}
				onToggleNote={toggleNoteCompletion}
				onDeleteNote={deleteNote}
				onEditNote={handleEditNote} // Pass handleEditNote to items
			/>
		</div>
	);
};

export default NoteList;
