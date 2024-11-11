"use client";

// import { useState } from "react";
import type { Note } from "@/types/types";
import { AnimatePresence } from "framer-motion";
import type React from "react";
// import { BiEdit } from "react-icons/bi";
// import { MdDeleteOutline } from "react-icons/md";
// import { renderIcon } from "@/helpers/helper";
// import Button from "./multiverse/Button";

interface NoteItemsProps {
	notes: Note[];
	onToggleNote: (id: string) => void;
	onDeleteNote: (id: string) => void;
	onEditNote: (note: Note) => void; // Add the edit handler
}

const NoteItems: React.FC<NoteItemsProps> = ({
	notes,
	// onToggleNote,
	// onDeleteNote,
	onEditNote,
}) => {
	// const [showMenu, setShowMenu] = useState<boolean>(false);
	const handleRightClick = (event: React.MouseEvent) => {
		event.preventDefault();

		// console.log(object);
	};
	return (
		<>
			{notes.map((note) => (
				<button
					onContextMenu={handleRightClick}
					className="my-1 flex w-full max-w-52 cursor-pointer flex-col items-start justify-center border-b border-l-4 px-3 transition-all duration-150 hover:bg-zinc-600"
					onClick={() => {
						onEditNote(note);
					}}
					key={note.id}
					type="button"
					aria-label={`Edit note ${note.id}`}
				>
					<AnimatePresence>
						{
							<>
								<h2 className="truncate text-nowrap">
									{note.title} {note.important && <span>(Important)</span>}
								</h2>
								<p className="truncate text-nowrap text-xs">{note.text}</p>

								<small className="my-2 text-nowrap text-[.5rem] brightness-90">
									Modified:{" "}
									{new Date(note.createdAt).toLocaleString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "numeric",
										minute: "numeric",
									}) ===
									new Date(note.updatedAt).toLocaleString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
										hour: "numeric",
										minute: "numeric",
									})
										? new Date(note.createdAt).toLocaleString(undefined, {
												month: "short",
												day: "numeric",
												year: "numeric",
												hour: "numeric",
												minute: "numeric",
										  })
										: new Date(note.updatedAt).toLocaleString(undefined, {
												month: "short",
												day: "numeric",
												year: "numeric",
												hour: "numeric",
												minute: "numeric",
										  })}
								</small>
							</>
						}
					</AnimatePresence>
				</button>
			))}
		</>
	);
};

export default NoteItems;
