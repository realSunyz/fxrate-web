import NavBar from "@/components/navbar";
import Table from "@/components/table";

export default function Home() {
  return (
    <body>
      <NavBar />
      <main className="flex min-h-screen dark:bg-gray-800">
        <Table />
      </main>
    </body>
  );
}
