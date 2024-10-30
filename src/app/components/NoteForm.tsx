import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { noteSchema, type NoteInput } from "@/schemas/schema";
import FormInput from "./multiverse/FormInput";
import Button from "./multiverse/Button";
import FormTextArea from "./multiverse/FormTextArea";

interface NoteFormProps {
	onAddNote: (title: string, text: string, important?: boolean) => void;
	onEditNote?: (
		id: string,
		title: string,
		text: string,
		important?: boolean,
	) => void; // Optional for editing
	onDeleteNote?: (id: string) => void; // Function to handle note deletion
	editingNote?: {
		id: string;
		title: string;
		text: string;
		important?: boolean;
	}; // Note to be edited
}

const NoteForm: React.FC<NoteFormProps> = ({
	onAddNote,
	onEditNote,
	onDeleteNote,
	editingNote,
}) => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
		setValue,
	} = useForm<NoteInput>({
		resolver: zodResolver(noteSchema),
	});

	useEffect(() => {
		if (editingNote && editingNote.id !== "") {
			// Pre-fill form when editing
			setValue("title", editingNote.title);
			setValue("text", editingNote.text);
			setValue("important", editingNote.important || false);
		} else {
			reset(); // Reset the form if editingNote is undefined or it's a new note
		}
	}, [editingNote, setValue, reset]);

	const onSubmit = (data: NoteInput) => {
		if (editingNote && onEditNote) {
			onEditNote(editingNote.id, data.title, data.text, data.important); // Call onEditNote if in edit mode
		} else {
			onAddNote(data.title, data.text, data.important);
		}
		reset(); // Reset form fields after submission
	};

	return (
		<form className="text-black" onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				// {...register("title")}
				value={watch("title") || ""}
				label="Title"
				name="title"
				placeholder="Type here"
				onChange={(value) => setValue("title", value)} // Update the form state on change
				error={errors.title}
			/>
			<FormTextArea
				{...register("text")}
				value={watch("text") || ""}
				label="Note"
				name="text"
				rows={10}
				placeholder="Type here"
				onChange={(value) => setValue("text", value)} // Update the form state on change
				error={errors.text}
			/>
			{/* <input hidden {...register("title")} /> */}
			<div className="flex items-end justify-end gap-4 ">
				{editingNote && editingNote.id !== "" && (
					<Button
						variant="outline"
						intent="danger"
						size="small"
						className="bg-transparent uppercase max-w-16"
						onClick={() => {
							if (onDeleteNote && editingNote) {
								onDeleteNote(editingNote.id); // Call the delete function with the note ID
							}
						}}
					>
						delete
					</Button>
				)}
				<Button size="small" type="submit" className="uppercase w-16">
					save
				</Button>
			</div>
		</form>
	);
};

export default NoteForm;
