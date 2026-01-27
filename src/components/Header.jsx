import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header
      className="w-full bg-white dark:bg-gray-800
                 border-b border-gray-200 dark:border-gray-700">
      <div
        className="max-w-7xl mx-auto px-4 py-3
                   flex items-center justify-between">
        
        <h1 className="text-lg font-semibold
                       text-gray-800 dark:text-gray-100">
          Enterprise Expense Portal
        </h1>

        <button
          onClick={handleLogout}
          className="text-sm px-3 py-1 rounded
                     bg-red-500 hover:bg-red-600
                     text-white transition-colors">
          Logout
        </button>
      </div>
    </header>
  );
}
