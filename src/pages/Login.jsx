import { useState } from "react";
import { loginUser } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser(email, password);
      window.location.href = "/";
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800
                      rounded-lg shadow-md p-6 sm:p-8">
        
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100
                       text-center mb-2">
          Enterprise Expense Portal
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400
                      text-center mb-6">
          Sign in with your corporate account
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 dark:text-red-400
                          text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium
                              text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         px-3 py-2 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium
                              text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700
                         text-gray-900 dark:text-gray-100
                         px-3 py-2 focus:outline-none
                         focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md
                       bg-blue-600 hover:bg-blue-700
                       text-white font-medium
                       disabled:opacity-50
                       transition-colors"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
