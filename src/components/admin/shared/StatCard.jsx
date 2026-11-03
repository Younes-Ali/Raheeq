export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#1b9c85",
  description,
}) {
  return (
    <div className="rounded-2xl border border-[#e9e1d2] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-[#173f32]">{value}</h3>
        </div>

        {Icon && (
          <div
            className="rounded-xl p-3"
            style={{ backgroundColor: `${color}18`, color }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>

      {description && (
        <p className="mt-3 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}
