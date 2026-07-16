import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(res.data);
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
        <h1 className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
          💸 Expense Splitter
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="text-xl"
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <span
            onClick={() => navigate("/profile")}
            className={`text-sm cursor-pointer hover:text-blue-600 transition ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Hey, {user?.name} 👋
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            Your Groups
          </h2>
          <button
            onClick={() => navigate("/create-group")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            + New Group
          </button>
        </div>

        {groups.length === 0 ? (
          <div className={`rounded-2xl shadow-sm p-10 text-center ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-400"}`}>
            <p className="text-4xl mb-3">👥</p>
            <p className="text-lg font-medium">No groups yet</p>
            <p className="text-sm mt-1">Create a group to start splitting expenses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {groups.map((group) => (
              <div
                key={group._id}
                onClick={() => navigate(`/group/${group._id}`)}
                className={`rounded-2xl shadow-sm p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition ${darkMode ? "bg-gray-800" : "bg-white"}`}
              >
                <div>
                  <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-blue-400 text-xl">→</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;