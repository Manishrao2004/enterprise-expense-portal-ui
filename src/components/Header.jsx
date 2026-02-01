import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 
                       backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 
                      flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-lg">E</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Enterprise Portal
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 rounded-lg font-medium 
                     border border-slate-200 dark:border-slate-700 
                     text-slate-600 dark:text-slate-300
                     bg-white dark:bg-slate-800
                     shadow-sm
                     hover:text-red-600 hover:border-red-200 hover:bg-red-50 
                     dark:hover:text-red-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20
                     transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}