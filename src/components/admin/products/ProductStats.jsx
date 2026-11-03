import { Package, PackageX, CheckCircle } from "lucide-react";
import StatCard from "../shared/StatCard";

export default function ProductStats({
  totalProducts = 0,
  activeProducts = 0,
  outOfStock = 0,
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Total Products"
        value={totalProducts}
        icon={Package}
        color="#1b9c85"
      />

      <StatCard
        title="Active Products"
        value={activeProducts}
        icon={CheckCircle}
        color="#16a34a"
      />

      <StatCard
        title="Out of Stock"
        value={outOfStock}
        icon={PackageX}
        color="#ef4444"
      />
    </div>
  );
}
