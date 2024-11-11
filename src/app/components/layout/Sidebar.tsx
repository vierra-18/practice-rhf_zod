"use client";
import { renderIcon } from "@/app/utilities/helpers/helper";
import useNotes from "@/app/utilities/hooks/useNotes";
import type { Note } from "@/types/types";
import type React from "react";
import { IoCreateOutline } from "react-icons/io5";
import NoteItems from "../NoteItems";

interface SidebarProps {
	notes: Note[];
	onEditNote: (note: {
		id: string;
		title: string;
		text: string;
		important?: boolean;
		noteColor?: string;
	}) => void; // Callback to pass note back to parent
	onNewNote: () => void; // Callback to clear the current editing state
}

const Sidebar: React.FC<SidebarProps> = ({ onEditNote, onNewNote, notes }) => {
	const { toggleNoteCompletion, deleteNote, isLoading } = useNotes();

	const handleEditNote = (note: {
		id: string;
		title: string;
		text: string;
		important?: boolean;
		noteColor?: string;
	}) => {
		onEditNote(note); // Call the parent's callback with the edited note
	};

	return (
		<div className="no-scrollbar relative flex max-h-screen min-h-screen min-w-52 flex-col self-start overflow-y-auto">
			<div className="sticky top-0 flex min-h-16 items-center justify-between border-b border-l bg-zinc-800 px-6">
				<h1 className="font-mono uppercase">notes</h1>
				{/* Button to clear editing and create a new note */}
				<button
					onClick={onNewNote}
					className="flex w-fit items-center justify-center"
					type="button"
				>
					{renderIcon(IoCreateOutline)}
				</button>
			</div>
			{isLoading || !notes ? (
				<h1>...loading</h1>
			) : notes.length === 0 ? (
				<div className="grid place-items-center py-6 opacity-40">
					<h1>no notes yet</h1>
				</div>
			) : (
				<NoteItems
					notes={notes}
					onToggleNote={toggleNoteCompletion}
					onDeleteNote={deleteNote}
					onEditNote={handleEditNote} // Pass handleEditNote to items
				/>
			)}
		</div>
	);
};

export default Sidebar;
