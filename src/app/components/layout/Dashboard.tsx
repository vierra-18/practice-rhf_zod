"use client";
import useNotes from "@/hooks/useNotes";
import { useState } from "react";
import NoteForm from "../NoteForm";
import Playground from "../Playground";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Dashboard() {
	const { addNote, editNote, notes, deleteNote } = useNotes();

	const [editingNote, setEditingNote] = useState<
		| {
				id: string;
				title: string;
				text: string;
				important?: boolean;
				noteColor?: string;
		  }
		| undefined
	>(undefined);

	// Callback function to receive the editing note from Sidebar
	const handleEditNote = (note: {
		id: string;
		title: string;
		text: string;
		important?: boolean;
		noteColor?: string;
	}) => {
		setEditingNote(note);
	};

	// Function to reset the form and clear the editing note
	const handleNewNote = () => {
		// By resetting editingNote to undefined, it will re-render the form as empty
		setEditingNote({
			id: "",
			title: "",
			text: "",
			important: false,
			noteColor: "",
		});
	};

	// Function to handle deleting a note
	const handleDeleteNote = (id: string) => {
		deleteNote(id); // This should call your delete logic from useNotes
		setEditingNote(undefined); // Clear the editing state after deletion
	};

	const handleUpdateNote = (
		id: string,
		title: string,
		text: string,
		important?: boolean,
		noteColor?: string
	) => {
		editNote(id, title, text, important, noteColor);
		setEditingNote(undefined); // Clear edit mode after updating
	};

	return (
		<div className=" flex min-h-screen w-full">
			{/* <Sidebar
				notes={notes}
				onEditNote={handleEditNote}
				onNewNote={handleNewNote}
			/> */}
			<div className="flex min-h-full w-full flex-col border-black border-l">
				<Topbar />
				<div className="p-6 ">
					{/* <NoteForm
						key={editingNote ? editingNote.id : "new"} // Add key to force re-render
						onAddNote={addNote}
						onEditNote={handleUpdateNote}
						editingNote={editingNote} // Pass editingNote as undefined or note object
						onDeleteNote={handleDeleteNote}
					/> */}
					<Playground />
				</div>
			</div>
		</div>
	);
}
