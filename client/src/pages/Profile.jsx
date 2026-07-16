import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ groups: 0 });
  const token = localStorage.getItem("token");
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const groupsRes = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats({ groups: groupsRes.data.length });
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Navbar */}
      <div className={`shadow-sm px-6 py-4 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h1
          onClick={() => navigate("/dashboard")}
          className={`text-xl font-bold cursor-pointer ${darkMode ? "text-blue-400" : "text-blue-600"}`}
        >
          💸 Expense Splitter
        </h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleDarkMode} className="text-xl">
            {darkMode ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"} hover:text-gray-700`}
          >
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Profile Card */}
        <div className={`rounded-2xl shadow-sm p-8 text-center mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 ${darkMode ? "bg-gray-700" : "bg-blue-100"}`}>
            👤
          </div>
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            {user?.name}
          </h2>
          <p className="text-gray-400 mt-1">{user?.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className={`rounded-2xl shadow-sm p-6 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              {stats.groups}
            </p>
            <p className="text-sm text-gray-400 mt-1">Groups Joined</p>
          </div>
          <div className={`rounded-2xl shadow-sm p-6 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className="text-3xl font-bold">💸</p>
            <p className="text-sm text-gray-400 mt-1">Active Splitter</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-2xl font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;