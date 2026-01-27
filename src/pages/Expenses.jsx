import { useEffect, useState } from "react";
import api from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { getUserRole } from "../utils/auth";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();

  const fetchExpenses = async () => {
    setLoading(true);
    const res = await api.get("/expenses");
    setExpenses(res.data.expenses);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="space-y-6">
      <ExpenseForm onAdded={fetchExpenses} />

      {loading ? (
        <p className="text-gray-500">Loading expenses...</p>
      ) : (
        <ExpenseList expenses={expenses} role={role} onAction={fetchExpenses} />
      )}
    </div>
  );
}
