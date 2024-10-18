// src/app/lib/schemas/todoSchema.ts

import { z } from 'zod';

// Define the schema for a Todo item
export const todoSchema = z.object({
  title: z.string().min(1, "yeet"),    // Title is a required string
  text: z.string().min(1, "boom"),      // Text is a required string
  important: z.boolean().optional(),                 // Important is an optional boolean
});

// Export the type inferred from the schema
export type TodoInput = z.infer<typeof todoSchema>;
