import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#6366f1",
  "#e9b949",
  "#a855f7",
  "#1b9c85",
  "#ef4444",
];

export default function OrdersStatusChart({ data = [] }) {
  const hasData = data.some((item) => Number(item.value) > 0);

  return (
    <div className="rounded-2xl border border-[#e9e1d2] bg-white p-5">
      <h3 className="mb-5 font-bold text-[#173f32]">Orders by Status</h3>

      {!hasData ? (
        <div className="flex h-64 items-center justify-center text-sm text-gray-400">
          No orders available
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={85}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
