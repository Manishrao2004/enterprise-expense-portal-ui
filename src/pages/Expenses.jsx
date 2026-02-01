import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseFilters from "../components/ExpenseFilters";
import { getUserRole } from "../utils/auth";
import { useExpenseData } from "../hooks/useExpenseData";
import { CopyPlus, Clock, History, User, CreditCard } from "lucide-react"; 

export default function Expenses() {
  const role = getUserRole();
  // Default Tabs: Manager->approvals
  const [activeTab, setActiveTab] = useState(() => {
    if (role === "MANAGER") return "approvals";
    return "personal";
  });

  // Custom Hook driving the data logic
  const { 
    expenses, 
    loading, 
    filters, 
    setFilter, 
    sortConfig, 
    handleSort, 
    refresh,
    resetFilters 
  } = useExpenseData(role, activeTab);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    resetFilters();
  };

  // Tab Button Helper
  const TabButton = ({ value, label, icon: Icon }) => (
    <button
      onClick={() => handleTabChange(value)}
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
        ${activeTab === value 
            ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500" 
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      
      {/* 1. Role-Based Navigation/Tabs */}
      {role === "MANAGER" && (
          <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap gap-2">
            <TabButton value="approvals" label="Approvals Needed" icon={Clock} />
            <TabButton value="history" label="Team History" icon={History} />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2 self-center hidden sm:block"></div>
            <TabButton value="personal" label="My Expenses" icon={User} />
          </div>
      )}

      {role === "EMPLOYEE" && (
          // Just a title for employees, they don't have other tabs usually
          // Or strictly they are always in personal.
          null
      )}

      {/* 2. Add Expense (Visible in Personal Tab) */}
      {activeTab === "personal" && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 mb-4">
            <CopyPlus className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Expense</h3>
          </div>
          <ExpenseForm onAdded={() => refresh()} />
        </div>
      )}

      {/* 3. Filters */}
      <ExpenseFilters
        status={filters.status}
        setStatus={(val) => setFilter("status", val)}
        from={filters.from}
        setFrom={(val) => setFilter("from", val)}
        to={filters.to}
        setTo={(val) => setFilter("to", val)}
        search={filters.search}
        setSearch={(val) => setFilter("search", val)}
        hideStatus={activeTab === "approvals"} // Hide status for queued items
      />

      {/* 4. List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
            <ExpenseList
            expenses={expenses}
            role={role}
            isManagerView={activeTab === 'approvals'} // Pass basic manager status
            showUserColumn={activeTab !== 'personal'}
            onAction={refresh}
            sortConfig={sortConfig}
            onSort={handleSort}
            />
        </div>
      )}
    </div>
  );
}