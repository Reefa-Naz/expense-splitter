import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-2xl shadow-md w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            Create Account 💸
          </h2>
          <button onClick={toggleDarkMode} className="text-xl">
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className={`text-sm text-center mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-medium hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;