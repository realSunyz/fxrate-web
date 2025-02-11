import NavBar from "@/components/navbar";
import Table from "@/components/table";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <body className="bg-white text-gray-600 antialiased dark:bg-gray-900 dark:text-gray-400">
      <NavBar />
      <main className="flex w-full min-w-0">
        <Table />
      </main>
      <Footer />
    </body>
  );
}
