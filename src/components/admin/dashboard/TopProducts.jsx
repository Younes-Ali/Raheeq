import { Package } from "lucide-react";

export default function TopProducts({ products = [] }) {
  return (
    <div className="rounded-2xl border border-[#e9e1d2] bg-white p-5">
      <h3 className="mb-5 font-bold text-[#173f32]">Top Products</h3>

      {products.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center text-gray-400">
          <Package size={35} />
          <p className="mt-2 text-sm">No product sales yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.id || product.name}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f5f1e8] text-sm font-bold text-[#173f32]">
                  {index + 1}
                </span>

                <div className="min-w-0">
                  <p className="truncate font-medium text-[#173f32]">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.quantity} sold
                  </p>
                </div>
              </div>

              <p className="shrink-0 font-semibold text-[#1b9c85]">
                {Number(product.revenue || 0).toLocaleString("en-US")} EGP
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
