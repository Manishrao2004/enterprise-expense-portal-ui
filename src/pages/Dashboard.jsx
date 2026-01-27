import Expenses from "./Expenses";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        My Expenses
      </h2>

      <Expenses />
    </div>
  );
}
