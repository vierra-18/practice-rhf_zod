// import Image from "next/image";
import TodoList from "./components/TodoList";

export default function Home() {
	return (
		<div className="bg-gray-800 w-screen h-screen">
			<main className="grid place-items-center w-full h-full">
				<div className="h-full container flex flex-col justify-center items-center -2">
					<TodoList/>
				</div>
			</main>
		</div>
	);
}
