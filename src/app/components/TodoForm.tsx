// src/app/components/TodoForm.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { todoSchema, TodoInput } from "@lib/schemas/schema"; // Import schema and type
import FormInput from "./multiverse/FormInput";
import FormTextArea from "./multiverse/FormTextArea";

interface TodoFormProps {
	onAddTodo: (title: string, text: string, important?: boolean) => void; // Type for onAddTodo prop
}

const TodoForm: React.FC<TodoFormProps> = ({ onAddTodo }) => {
	// Use react-hook-form to manage form state
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<TodoInput>({
		resolver: zodResolver(todoSchema), // Use Zod for validation
	});

	const onSubmit = (data: TodoInput) => {
		onAddTodo(data.title, data.text, data.important); // Call onAddTodo with form data if no errors

		reset(); // Reset form fields
	};

	return (
		<form className=" w-full" onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				{...register("title")}
				value={watch("title") || ""}
				label="Note Title"
				name="title"
				placeholder="Enter title here"
				onChange={(value) => setValue("title", value)} // Update the form state on change
				error={errors.title}
			/>
			<input
				className="hidden"
				{...register("title")}
				placeholder="Todo Title"
			/>
			{errors.title && <span className="hidden">{errors.title.message}</span>}
			<FormTextArea
				{...register("text")}
				value={watch("text") || ""}
				label="Note Title"
				name="text"
				placeholder="Enter title here"
				onChange={(value) => setValue("text", value)} // Update the form state on change
				error={errors.text}
			/>
			<input
				className="hidden"
				{...register("text")}
				placeholder="Todo Description"
			/>
			{errors.text && <span className="hidden">{errors.text.message}</span>}
			<label>
				<input type="checkbox" {...register("important")} />
				Important
			</label>
			<button type="submit">Add Todo</button>
		</form>
	);
};

export default TodoForm;
