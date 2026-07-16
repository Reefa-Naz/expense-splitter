import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <div className={`p-8 rounded-2xl shadow-md w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            Welcome Back 👋
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
            Login
          </button>
        </form>

        <p className={`text-sm text-center mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;