// src/lib/types/types.ts
export interface Note {
	id: string;
	title: string;
	text: string;
	completed?: boolean;
	noteColor?: string; // Add color attribute
	important: boolean;
	createdAt: string;
	updatedAt: string;
}
