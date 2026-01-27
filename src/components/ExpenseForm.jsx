import { useEffect, useState } from "react";
import api from "../services/api";

export default function ExpenseForm({ onAdded }) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data.categories);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await api.post("/expenses", {
      amount: Number(amount),
      category_id: Number(categoryId),
    });

    setAmount("");
    setCategoryId("");
    setLoading(false);
    onAdded();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800
                 p-4 rounded-lg shadow space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="number"
          placeholder="Amount"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded border px-3 py-2
                     bg-white dark:bg-gray-700"
        />

        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded border px-3 py-2
                     bg-white dark:bg-gray-700"
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700
                     text-white rounded px-4 py-2
                     disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Expense"}
        </button>
      </div>
    </form>
  );
}
