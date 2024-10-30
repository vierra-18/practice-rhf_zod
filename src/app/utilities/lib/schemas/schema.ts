import { z } from "zod";

// Note input schema with title, text, and important fields
export const noteSchema = z.object({
	title: z.string({ required_error: "Title is Required" }).min(1),
	text: z.string({ required_error: "Description is Required" }).min(1),
	important: z.boolean().optional(),
});

// NoteInput type derived from the schema
export type NoteInput = z.infer<typeof noteSchema>;
