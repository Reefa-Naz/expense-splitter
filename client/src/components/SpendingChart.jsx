import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useTheme } from "../context/ThemeContext";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#3b82f6",
  "#8b5cf6"
];

const CATEGORY_EMOJI = {
  Food: "🍔",
  Travel: "✈️",
  Hotel: "🏨",
  Shopping: "🛍️",
  Entertainment: "🎬",
  Other: "📦"
};

function SpendingChart({ expenses }) {
  const { darkMode } = useTheme();

  const categoryTotals = expenses.reduce((acc, exp) => {
    const cat = exp.category || "Other";
    acc[cat] = (acc[cat] || 0) + exp.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name: `${CATEGORY_EMOJI[name] || "📦"} ${name}`,
    value: parseFloat(value.toFixed(2))
  }));

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={`rounded-2xl shadow-sm p-6 mt-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      <h3 className={`text-xl font-bold mb-1 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Spending Breakdown
      </h3>
      <p className="text-sm text-gray-400 mb-6">
        Total: ₹{total.toFixed(2)}
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="text-sm">
              <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                {item.name}
              </span>
              <span className="text-gray-400 ml-1">₹{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpendingChart;