import { Eye } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";
import EmptyState from "../shared/EmptyState";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} EGP`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB");
};

export default function OrdersTable({ orders = [], onView }) {
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-[#e9e1d2] bg-white">
        <EmptyState
          title="No orders found"
          description="Orders will appear here when customers place them."
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
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eee]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#faf9f6]">
                <td className="px-5 py-4 font-semibold text-[#173f32]">
                  #{order.order_no || order.id}
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-[#173f32]">
                    {order.customer_name}
                  </p>
                  <p className="text-xs text-gray-500">{order.phone}</p>
                </td>

                <td className="px-5 py-4 text-sm text-gray-600">
                  {formatDate(order.created_at)}
                </td>

                <td className="px-5 py-4 font-semibold text-[#173f32]">
                  {formatPrice(order.total)}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={order.payment_status} />
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    type="button"
                    onClick={() => onView?.(order)}
                    title="View order"
                    className="rounded-lg p-2 text-[#1b9c85] hover:bg-green-50"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
