import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import SpendingChart from "../components/SpendingChart";

const CATEGORIES = [
  { name: "Food", emoji: "🍔" },
  { name: "Travel", emoji: "✈️" },
  { name: "Hotel", emoji: "🏨" },
  { name: "Shopping", emoji: "🛍️" },
  { name: "Entertainment", emoji: "🎬" },
  { name: "Other", emoji: "📦" },
];

function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "Other"
  });
  const [memberEmail, setMemberEmail] = useState("");
  const [memberError, setMemberError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    fetchGroup();
    fetchExpenses();
    fetchBalances();
    fetchSettlements();
  }, []);

  const fetchGroup = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroup(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBalances = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/groups/${id}/balances`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBalances(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSettlements = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/settlements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettlements(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const members = group.members;
      const share = parseFloat(expenseForm.amount) / members.length;
      const splitBetween = members.map((member) => ({
        user: member._id,
        share: parseFloat(share.toFixed(2))
      }));
      await axios.post(
        "http://localhost:5000/api/expenses",
        {
          groupId: id,
          description: expenseForm.description,
          amount: parseFloat(expenseForm.amount),
          category: expenseForm.category,
          splitBetween
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenseForm({ description: "", amount: "", category: "Other" });
      setShowExpenseForm(false);
      fetchExpenses();
      fetchBalances();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMemberError("");
    try {
      await axios.post(
        `http://localhost:5000/api/groups/${id}/members`,
        { email: memberEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMemberEmail("");
      setShowMemberForm(false);
      fetchGroup();
    } catch (err) {
      setMemberError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
      fetchBalances();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSettleUp = async (toUserId, amount) => {
    if (!window.confirm(`Settle ₹${Math.abs(amount)}?`)) return;
    try {
      await axios.post(
        "http://localhost:5000/api/settlements",
        { groupId: id, paidTo: toUserId, amount: Math.abs(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBalances();
      fetchSettlements();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteSettlement = async (settlementId) => {
    if (!window.confirm("Delete this settlement?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/settlements/${settlementId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSettlements();
      fetchBalances();
    } catch (err) {
      console.log(err);
    }
  };

  const getCategoryEmoji = (categoryName) => {
    const cat = CATEGORIES.find((c) => c.name === categoryName);
    return cat ? cat.emoji : "📦";
  };

  const positiveBalances = balances.filter(
    (b) => b.balance > 0 && b.userId !== user?.id
  );

  const filteredExpenses = expenses.filter((exp) => {
    const matchSearch = searchTerm
      ? exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchCategory = filterCategory
      ? exp.category === filterCategory
      : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      {/* Navbar */}
      <div className={`shadow-sm px-4 md:px-6 py-4 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
          💸 Expense Splitter
        </h1>
        <div className="flex items-center gap-3">
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

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">

        {/* Group Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
            {group?.name || "Loading..."}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMemberForm(!showMemberForm)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium transition text-sm ${darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
            >
              + Add Member
            </button>
            <button
              onClick={() => setShowExpenseForm(!showExpenseForm)}
              className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
            >
              + Add Expense
            </button>
          </div>
        </div>

        {/* Members */}
        {group?.members?.length > 0 && (
          <div className={`rounded-2xl shadow-sm p-5 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className={`text-sm font-semibold mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              MEMBERS
            </p>
            <div className="flex flex-wrap gap-2">
              {group.members.map((member) => (
                <span
                  key={member._id}
                  className={`text-sm px-3 py-1 rounded-full ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                >
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add Member Form */}
        {showMemberForm && (
          <div className={`rounded-2xl shadow-sm p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Add Member by Email
            </h3>
            {memberError && (
              <p className="text-red-500 text-sm mb-3">{memberError}</p>
            )}
            <form onSubmit={handleAddMember} className="flex flex-col md:flex-row gap-3">
              <input
                type="email"
                placeholder="friend@example.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                required
                className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Add
              </button>
            </form>
          </div>
        )}

        {/* Add Expense Form */}
        {showExpenseForm && (
          <div className={`rounded-2xl shadow-sm p-6 mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              New Expense
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <input
                type="text"
                placeholder="Description (e.g. Hotel booking)"
                value={expenseForm.description}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, description: e.target.value })
                }
                required
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
              />
              <input
                type="number"
                placeholder="Amount (₹)"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, amount: e.target.value })
                }
                required
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
              />

              {/* Category Selector */}
              <div>
                <p className={`text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Category
                </p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      type="button"
                      key={cat.name}
                      onClick={() =>
                        setExpenseForm({ ...expenseForm, category: cat.name })
                      }
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                        expenseForm.category === cat.name
                          ? "bg-blue-600 text-white border-blue-600"
                          : darkMode
                          ? "bg-gray-700 text-gray-300 border-gray-600 hover:border-blue-400"
                          : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Add
              </button>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        {expenses.length > 0 && (
          <div className={`rounded-2xl shadow-sm p-4 mb-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="🔍 Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "border-gray-300"}`}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "border-gray-300"}`}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Expenses List */}
        {expenses.length === 0 ? (
          <div className={`rounded-2xl shadow-sm p-10 text-center ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-400"}`}>
            <p className="text-4xl mb-3">🧾</p>
            <p className="text-lg font-medium">No expenses yet</p>
            <p className="text-sm mt-1">Add an expense to start tracking</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className={`rounded-2xl shadow-sm p-10 text-center ${darkMode ? "bg-gray-800 text-gray-400" : "bg-white text-gray-400"}`}>
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredExpenses.map((exp) => (
              <div key={exp._id} className={`rounded-2xl shadow-sm p-5 md:p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCategoryEmoji(exp.category)}</span>
                    <div>
                      <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                        {exp.description}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        Paid by {exp.paidBy?.name} •{" "}
                        <span className="text-blue-400">{exp.category}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-base md:text-lg font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                      ₹{exp.amount}
                    </p>
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      className="text-red-400 hover:text-red-600 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Spending Chart */}
        {expenses.length > 0 && <SpendingChart expenses={expenses} />}

        {/* Balances */}
        {balances.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Balances
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {balances.map((b) => (
                <div
                  key={b.userId}
                  className={`rounded-2xl shadow-sm p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-3 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  <div>
                    <p className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                      {b.name}
                    </p>
                    <p
                      className={`font-bold text-lg ${
                        b.balance > 0
                          ? "text-green-500"
                          : b.balance < 0
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    >
                      {b.balance > 0
                        ? `gets back ₹${b.balance}`
                        : b.balance < 0
                        ? `owes ₹${Math.abs(b.balance)}`
                        : "✓ settled up"}
                    </p>
                  </div>
                  {b.userId === user?.id && b.balance < 0 && (
                    <div className="flex flex-wrap gap-2">
                      {positiveBalances.map((creditor) => (
                        <button
                          key={creditor.userId}
                          onClick={() => handleSettleUp(creditor.userId, b.balance)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                        >
                          Pay {creditor.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settlement History */}
        {settlements.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-800"}`}>
              Settlement History
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {settlements.map((s) => (
                <div
                  key={s._id}
                  className={`rounded-2xl shadow-sm p-5 flex justify-between items-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
                >
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    <span className="font-medium">{s.paidBy?.name}</span>
                    {" paid "}
                    <span className="font-medium">{s.paidTo?.name}</span>
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-green-500">₹{s.amount}</p>
                    <button
                      onClick={() => handleDeleteSettlement(s._id)}
                      className="text-red-400 hover:text-red-600 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupDetail;