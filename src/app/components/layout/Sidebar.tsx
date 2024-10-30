"use client";
import type React from "react";
import useNotes from "@/app/utilities/hooks/useNotes";
import NoteItems from "../NoteItems";
import type { Note } from "@/types/types";
import { renderIcon } from "@/app/utilities/helpers/helper";
import { IoCreateOutline } from "react-icons/io5";

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
		<div className="flex flex-col no-scrollbar relative min-h-screen overflow-y-auto max-h-screen min-w-52 self-start border-r">
			<div className="min-h-16 flex justify-between items-center px-6 border-b border-l sticky top-0 bg-zinc-800">
				<h1 className="uppercase font-mono">notes</h1>
				{/* Button to clear editing and create a new note */}
				<button
					onClick={onNewNote}
					className="flex items-center justify-center w-fit"
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
