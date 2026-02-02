import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import RegisterModal from "./RegisterModal";
import axios from "axios";
import apiClient from "../services/apiClient"

export default function LoginModal({ onClose, onLogin, onOpenRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill both fields");
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post("/auth/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      // response contains token and user
      const { token, user } = res.data;

      // store token and user — localStorage for simplicity
      localStorage.setItem("rb_token", token);
      localStorage.setItem("rb_user", JSON.stringify(user));

      // optional: set axios default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // notify parent (Navbar) that login happened
      if (onLogin) onLogin(user);

      alert("Login successful ✅");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg w-11/12 sm:w-[420px] p-6 relative"
          initial={{ scale: 0.95, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: -10 }}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-600 hover:text-black">
            <X size={20} />
          </button>

          <h2 className="text-2xl font-semibold text-center text-orange-600 mb-4">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account? 
            <button
              className="text-orange-600 underline ml-1"
              onClick={() => {
                if (onOpenRegister) onOpenRegister();
              }}
            >
              Register
            </button>
          </div>

          {showRegister && (
            <RegisterModal
              onClose={() => setShowRegister(false)}
              onLogin={(user) => {
                // Auto-login right after successful registration
                if (onLogin) onLogin(user);
                setShowRegister(false);
              }}
            />
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
