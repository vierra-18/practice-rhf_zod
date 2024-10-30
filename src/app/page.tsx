// import Image from "next/image";
import Dashboard from './components/layout/Dashboard';
// import NoteList from "./components/NoteList";

export default function Home() {
  return (
    <div className="min-h-screen max-w-screen bg-zinc-800">
      <main className="grid h-full w-full place-items-center">
        <div className="container flex h-full flex-col items-center justify-center ">
          {/* <Sidebar /> */}
          <Dashboard />
        </div>
      </main>
    </div>
  );
}
