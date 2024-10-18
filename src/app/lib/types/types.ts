export type Todo = {
  id: string;
  title: string;      // Title of the todo item
  text: string;       // Description or details about the todo item
  completed: boolean; // Status indicating if the todo is completed
  important?: boolean; // Flag to mark the todo as important
};
