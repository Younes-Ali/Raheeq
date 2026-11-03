import { Edit, Trash2, Power, PackageOpen } from "lucide-react";

import EmptyState from "../shared/EmptyState";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} EGP`;

export default function ProductsTable({
  products = [],
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  if (!products.length) {
    return (
      <div className="rounded-2xl border border-[#e9e1d2] bg-white">
        <EmptyState
          title="No products found"
          description="Try changing your search or add a new product."
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9e1d2] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#faf9f6] text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eee]">
            {products.map((product) => {
              const active =
                product.is_active === true ||
                String(product.is_active).toLowerCase() === "true";

              return (
                <tr key={product.id} className="hover:bg-[#faf9f6]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {product.img ? (
                        <img
                          src={product.img}
                          alt={product.name}
                          className="h-12 w-12 rounded-xl border border-[#eee] object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f5f1e8]">
                          <PackageOpen className="text-[#1b9c85]" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-[#173f32]">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.category}
                  </td>

                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#173f32]">
                      {formatPrice(product.price)}
                    </div>

                    {Number(product.old_price) > Number(product.price) && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.old_price)}
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {product.stock}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit?.(product)}
                        title="Edit product"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Edit size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus?.(product)}
                        title="Toggle status"
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                      >
                        <Power size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(product)}
                        title="Delete product"
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
