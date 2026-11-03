import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "No data found",
  description = "There is nothing to display yet.",
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center px-4 text-center">
      <PackageOpen size={42} className="mb-3 text-gray-300" />

      <h3 className="font-semibold text-[#173f32]">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
