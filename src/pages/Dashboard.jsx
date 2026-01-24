import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import StatsGrid from "../components/StatsGrid";
import SpendingChart from "../components/SpendingChart";
import ExpenseList from "../components/ExpenseList";
import ExpenseModal from "../components/ExpenseModal";

import api from "../services/api";

import { Plus } from "lucide-react";
import StatsGridSkeleton from "../components/StatsGridSkeleton";
import SpendingChartSkeleton from "../components/SpendingChartSkeleton";
import ExpenseListSkeleton from "../components/ExpenseListSkeleton";

import toast from "react-hot-toast";

function Dashboard() {
  const [total, setTotal] = useState(0);
  const [monthly, setMonthly] = useState(0);
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [totalRes, monthlyRes, categoryRes, expensesRes] =
        await Promise.all([
          api.get("/analytics/total"),
          api.get("/analytics/monthly"),
          api.get("/analytics/category"),
          api.get("/expenses"),
        ]);

      setTotal(Number(totalRes.data.totalExpense));
      setMonthly(Number(monthlyRes.data.monthlyExpense));
      setCategories(
        categoryRes.data.categories.map((c) => ({
          ...c,
          total: Number(c.total),
        })),
      );
      setExpenses(expensesRes.data.expenses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setAmount(expense.amount);
      setCategory(expense.category);
    } else {
      setEditingExpense(null);
      setAmount("");
      setCategory("");
    }
    setShowForm(true);
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense.id}`, {
          amount: Number(amount),
          category,
        });
        toast.success("Expense updated");
      } else {
        await api.post("/expenses", {
          amount: Number(amount),
          category,
        });
        toast.success("Expense added");
      }

      setAmount("");
      setCategory("");
      setEditingExpense(null);
      setShowForm(false);
      fetchData();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="flex gap-3 items-center">
        <span>Delete this expense?</span>
        <button
          onClick={async () => {
            toast.dismiss(t.id);
            try {
              await api.delete(`/expenses/${id}`);
              fetchData();
              toast.success("Expense deleted");
            } catch {
              toast.error("Failed to delete expense");
            }
          }}
          className="text-red-400 font-medium"
        >
          Delete
        </button>
      </div>
    ));
  };

  const handleLogout = () => {
    toast.success("Logged out");
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  return (
    // FIX 1: Added overflow-x-hidden to prevent horizontal white space
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900">
      <Navbar onAdd={() => openModal()} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Mobile FAB */}
        <button
          onClick={() => openModal()}
          className="sm:hidden fixed bottom-6 right-6 z-40 bg-indigo-600 text-white p-4 rounded-full shadow-xl shadow-indigo-600/30 active:scale-90 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Stats Grid */}
        {loading ? (
          <StatsGridSkeleton />
        ) : (
          <StatsGrid
            total={total}
            monthly={monthly}
            categoryCount={categories.length}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          {loading ? (
            <SpendingChartSkeleton />
          ) : (
            <SpendingChart categories={categories} />
          )}

          {/* Recent Expenses List */}
          {loading ? (
            <ExpenseListSkeleton />
          ) : (
            <ExpenseList
              expenses={expenses}
              onEdit={openModal}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* Modal Form Overlay */}
      <ExpenseModal
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitExpense}
        amount={amount}
        setAmount={setAmount}
        category={category}
        setCategory={setCategory}
        editingExpense={editingExpense}
      />
    </div>
  );
}

export default Dashboard;
