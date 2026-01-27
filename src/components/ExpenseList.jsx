import api from "../services/api";
import StatusBadge from "./StatusBadge";

export default function ExpenseList({ expenses, role, onAction }) {
  if (expenses.length === 0) {
    return (
      <p className="text-gray-500">
        No expenses recorded yet.
      </p>
    );
  }

  const handleApprove = async (id) => {
    await api.patch(`/expenses/${id}/approve`);
    onAction();
  };

  const handleReject = async (id) => {
    await api.patch(`/expenses/${id}/reject`);
    onAction();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded shadow">
        <thead>
          <tr className="text-left border-b dark:border-gray-700">
            <th className="p-3">Category</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            {role === "MANAGER" && (
              <th className="p-3">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {expenses.map((e) => (
            <tr
              key={e.id}
              className="border-b dark:border-gray-700"
            >
              <td className="p-3">{e.category}</td>
              <td className="p-3">₹{e.amount}</td>
              <td className="p-3">
                <StatusBadge status={e.status} />
              </td>
              <td className="p-3">
                {new Date(e.created_at).toLocaleDateString()}
              </td>

              {role === "MANAGER" && (
                <td className="p-3 space-x-2">
                  {e.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => handleApprove(e.id)}
                        className="px-2 py-1 text-sm rounded
                                   bg-green-600 hover:bg-green-700
                                   text-white"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(e.id)}
                        className="px-2 py-1 text-sm rounded
                                   bg-red-600 hover:bg-red-700
                                   text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
