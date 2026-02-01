import { useState } from "react";
import { loginUser } from "../services/api";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Validation State
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const validate = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate();
  };

  const handleChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    
    // Clear error as user types
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");
    setTouched({ email: true, password: true });

    if (!validate()) return;

    setLoading(true);

    try {
      await loginUser(email, password);
      window.location.href = "/";
    } catch (err) {
      setGeneralError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
                    bg-gradient-to-br from-indigo-50 via-white to-cyan-50 
                    dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 
                      rounded-2xl shadow-xl ring-1 ring-slate-900/5 p-8 sm:p-10
                      transform transition-all">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sign in to the Enterprise Expense Portal
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 
                          text-sm text-red-600 dark:text-red-400 flex items-center gap-2 
                          border border-red-100 dark:border-red-800 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
                <input
                type="email"
                value={email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full rounded-xl border 
                            bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white
                            px-4 py-3 text-sm focus:outline-none focus:ring-2 
                            transition-all duration-200 shadow-sm
                            ${errors.email && touched.email 
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30" 
                                : "border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-transparent"
                            }`}
                placeholder="you@company.com"
                />
                {errors.email && touched.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                )}
            </div>
            {errors.email && touched.email && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium animate-in slide-in-from-top-1">
                    {errors.email}
                </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
                <input
                type="password"
                value={password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full rounded-xl border 
                            bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-white
                            px-4 py-3 text-sm focus:outline-none focus:ring-2 
                            transition-all duration-200 shadow-sm
                            ${errors.password && touched.password 
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30" 
                                : "border-slate-200 dark:border-slate-600 focus:ring-indigo-500 focus:border-transparent"
                            }`}
                placeholder="••••••••"
                />
            </div>
             {errors.password && touched.password && (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium animate-in slide-in-from-top-1">
                    {errors.password}
                </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 
                       text-white font-semibold text-sm shadow-md hover:shadow-lg
                       focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transform active:scale-[0.98] transition-all duration-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}