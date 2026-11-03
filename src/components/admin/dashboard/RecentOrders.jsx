import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import StatusBadge from "../shared/StatusBadge";

export default function RecentOrders({ orders = [] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9e1d2] bg-white">
      <div className="flex items-center justify-between border-b border-[#e9e1d2] p-5">
        <div>
          <h3 className="font-bold text-[#173f32]">Recent Orders</h3>
          <p className="mt-1 text-sm text-gray-500">Latest customer orders</p>
        </div>

        <Link
          to="/admin/orders"
          className="flex items-center gap-2 text-sm font-semibold text-[#1b9c85] hover:underline"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#faf9f6] text-xs uppercase text-gray-500">
            <tr>
              <th className="px-5 py-4">Order</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eee]">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-10 text-center text-gray-400">
                  No recent orders
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#faf9f6]">
                  <td className="px-5 py-4 font-medium text-[#173f32]">
                    #{order.order_no || order.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {order.customer_name}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-[#173f32]">
                    {Number(order.total || 0).toLocaleString("en-US")} EGP
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
