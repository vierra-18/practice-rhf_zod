"use client";

import type React from "react";
// import { useState } from "react";
import type { Note } from "@/types/types";
import { AnimatePresence } from "framer-motion";
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
					className="border-l-4 w-full flex flex-col items-start justify-center max-w-52 px-3 my-1 border-b hover:bg-zinc-600 transition-all duration-150 cursor-pointer"
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
								<h2 className="text-nowrap truncate">
									{note.title} {note.important && <span>(Important)</span>}
								</h2>
								<p className="text-nowrap truncate text-xs">{note.text}</p>

								<small className="text-nowrap my-2 text-[.5rem] brightness-90">
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
