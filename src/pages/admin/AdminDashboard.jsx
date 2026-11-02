import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { adminLogout, adminRequest } from "../../api/admin";

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} EGP`;

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-GB");
};

const statusColors = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      const result = await adminRequest({
        action: "snapshot",
      });

      setData(result);
    } catch (error) {
      toast.error("Failed to load dashboard data");

      if (error.message === "unauthorized") {
        adminLogout();
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  function handleLogout() {
    adminLogout();
    navigate("/admin/login", { replace: true });
    toast.success("Logged out successfully");
  }

  const products = data?.products || [];
  const orders = data?.orders || [];
  const clients = data?.clients || [];

  const activeProducts = products.filter(
    (product) => String(product.is_active).toLowerCase() === "true",
  );

  const outOfStock = activeProducts.filter(
    (product) => Number(product.stock) <= 0,
  );

  const totalSales = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  const pendingOrders = orders.filter((order) =>
    ["new", "confirmed", "processing"].includes(order.status),
  );

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      description: `${activeProducts.length} active products`,
      icon: "📦",
    },
    {
      title: "Total Orders",
      value: orders.length,
      description: `${pendingOrders.length} pending orders`,
      icon: "🛍️",
    },
    {
      title: "Total Sales",
      value: formatPrice(totalSales),
      description: "Excluding cancelled orders",
      icon: "💰",
    },
    {
      title: "Out of Stock",
      value: outOfStock.length,
      description: "Products need restocking",
      icon: "⚠️",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f1e8]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#1b4d3e] border-t-transparent" />
          <p className="mt-4 text-[#1b4d3e]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] md:flex">
      <aside className="flex w-full flex-col bg-[#173f32] p-6 text-white md:min-h-screen md:w-64">
        <div>
          <h1 className="text-3xl font-bold">Raheeq</h1>
          <p className="mt-1 text-sm text-white/60">Admin Panel</p>
        </div>

        <nav className="mt-10 flex gap-2 md:flex-col">
          <Link
            to="/admin"
            className="rounded-lg bg-white/15 px-4 py-3 font-medium"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            Orders
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto hidden rounded-lg border border-white/20 px-4 py-3 text-left text-white/80 transition hover:bg-red-500 md:block"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#173f32]">Dashboard</h2>
            <p className="mt-2 text-gray-500">
              Welcome back! Here's what's happening with your store.
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="rounded-lg bg-[#1b4d3e] px-5 py-3 text-white transition hover:bg-[#1b9c85]"
          >
            Refresh Data
          </button>
        </header>

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#e9e1d2] bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>

                <span className="text-2xl">{stat.icon}</span>
              </div>

              <h3 className="mt-5 break-words text-2xl font-bold text-[#173f32]">
                {stat.value}
              </h3>

              <p className="mt-2 text-sm text-gray-400">{stat.description}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#e9e1d2] bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#173f32]">
                Recent Orders
              </h3>

              <Link
                to="/admin/orders"
                className="text-sm font-semibold text-[#1b9c85] hover:underline"
              >
                View all
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="py-8 text-center text-gray-400">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px] text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-400">
                      <th className="pb-4 font-medium">Order</th>
                      <th className="pb-4 font-medium">Customer</th>
                      <th className="pb-4 font-medium">Total</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...orders]
                      .sort(
                        (a, b) =>
                          new Date(b.created_at) - new Date(a.created_at),
                      )
                      .slice(0, 5)
                      .map((order) => (
                        <tr key={order.id} className="border-b last:border-0">
                          <td className="py-4 font-semibold text-[#173f32]">
                            {order.order_no}
                          </td>

                          <td className="py-4 text-gray-600">
                            {order.customer_name}
                          </td>

                          <td className="py-4 font-medium text-[#173f32]">
                            {formatPrice(order.total)}
                          </td>

                          <td className="py-4">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                statusColors[order.status] ||
                                "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {order.status || "new"}
                            </span>
                          </td>

                          <td className="py-4 text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#e9e1d2] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#173f32]">Quick Overview</h3>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Active Products</span>
                <strong className="text-[#173f32]">
                  {activeProducts.length}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Inactive Products</span>
                <strong className="text-[#173f32]">
                  {products.length - activeProducts.length}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Registered Clients</span>
                <strong className="text-[#173f32]">{clients.length}</strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Pending Orders</span>
                <strong className="text-[#173f32]">
                  {pendingOrders.length}
                </strong>
              </div>
            </div>

            <div className="mt-8 border-t pt-6">
              <p className="text-sm text-gray-500">
                Need to manage your inventory?
              </p>

              <Link
                to="/admin/products"
                className="mt-4 block rounded-lg bg-[#173f32] px-4 py-3 text-center font-semibold text-white transition hover:bg-[#1b9c85]"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
