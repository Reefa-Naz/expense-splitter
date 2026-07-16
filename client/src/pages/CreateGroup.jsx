import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function CreateGroup() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/groups",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
            Create a Group 👥
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
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Goa Trip, Flatmates"
              required
              className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Create Group
          </button>
        </form>

        <p
          onClick={() => navigate("/dashboard")}
          className={`text-sm text-center mt-4 cursor-pointer hover:text-gray-600 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
        >
          ← Back to Dashboard
        </p>
      </div>
    </div>
  );
}

export default CreateGroup;