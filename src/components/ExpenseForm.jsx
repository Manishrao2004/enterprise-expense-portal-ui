import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "sonner";

export default function ExpenseForm({ onAdded }) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.categories);
      } catch (error) {
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/expenses", {
        amount: Number(amount),
        category_id: Number(categoryId),
      });

      toast.success("Expense added successfully!");
      setAmount("");
      setCategoryId("");
      onAdded();
    } catch (error) {
      toast.error("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
        <div className="w-full sm:w-1/3">
            <label htmlFor="amount-input" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Amount</label>
            <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400">₹</span>
                <input
                  id="amount-input"
                  type="number"
                  placeholder="0.00"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 
                             bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                             focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
            </div>
        </div>

        <div className="w-full sm:w-1/3">
            <label htmlFor="category-select" className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Category</label>
            <select
              id="category-select"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 
                         bg-white dark:bg-slate-700 text-slate-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all
                         appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: `right 0.75rem center`,
                backgroundRepeat: `no-repeat`,
                backgroundSize: `1.25em 1.25em`,
              }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
        </div>

        <div className="w-full sm:w-1/3">
            <button
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                         text-white font-medium shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 active:scale-95"
            >
              {loading ? "Adding..." : "+ Add Expense"}
            </button>
        </div>
      </div>
    </form>
  );
}