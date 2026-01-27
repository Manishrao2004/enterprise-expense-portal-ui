import Header from "../components/Header";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col
                    bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto
                       w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}
