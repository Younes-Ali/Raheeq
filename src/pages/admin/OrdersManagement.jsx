import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Search,
  RefreshCw,
  Eye,
  Package,
  ShoppingBag,
  X,
  LogOut,
  User,
  Phone,
  MapPin,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { adminLogout, adminRequest } from "../../api/admin";

const ORDER_STATUSES = [
  { value: "new", label: "New" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUSES = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "refunded", label: "Refunded" },
];

const statusStyles = {
  new: "bg-blue-50 text-blue-700",
  confirmed: "bg-indigo-50 text-indigo-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

function parseItems(items) {
  if (Array.isArray(items)) return items;

  if (typeof items === "string") {
    try {
      const parsed = JSON.parse(items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return String(date);

  return parsed.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatPrice(price) {
  return `${Number(price || 0).toLocaleString("en-US")} EGP`;
}

function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        statusStyles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

export default function OrdersManagement() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  async function loadOrders() {
    try {
      setLoading(true);

      const data = await adminRequest({
        action: "list",
        sheet: "orders",
      });

      const normalized = (Array.isArray(data) ? data : []).map((order) => ({
        ...order,
        id: String(order.id),
        total: Number(order.total || 0),
        items: parseItems(order.items),
        status: String(order.status || "new").toLowerCase(),
        payment_status: String(order.payment_status || "unpaid").toLowerCase(),
      }));

      normalized.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setOrders(normalized);
    } catch (error) {
      toast.error(error.message || "Failed to load orders");

      if (
        error.message === "unauthorized" ||
        error.message === "session_expired"
      ) {
        adminLogout();
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        String(order.order_no || order.id)
          .toLowerCase()
          .includes(query) ||
        String(order.customer_name || "")
          .toLowerCase()
          .includes(query) ||
        String(order.phone || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: orders.length,
      new: orders.filter((order) => order.status === "new").length,
      processing: orders.filter((order) => order.status === "processing")
        .length,
      delivered: orders.filter((order) => order.status === "delivered").length,
    }),
    [orders],
  );

  async function updateOrder(updatedFields) {
    if (!selectedOrder || updating) return;

    try {
      setUpdating(true);

      const updatedOrder = {
        ...selectedOrder,
        ...updatedFields,
        updated_at: new Date().toISOString(),
      };

      await adminRequest({
        action: "upsert",
        sheet: "orders",
        record: updatedOrder,
      });

      setOrders((previous) =>
        previous.map((order) =>
          order.id === selectedOrder.id ? updatedOrder : order,
        ),
      );

      setSelectedOrder(updatedOrder);

      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-[#173f32] p-6 text-white md:min-h-screen md:w-64">
        <div>
          <h1 className="text-3xl font-bold">Raheeq</h1>

          <p className="mt-1 text-sm text-white/60">Admin Panel</p>
        </div>

        <nav className="mt-10 flex gap-2 md:flex-col">
          <Link
            to="/admin"
            className="rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg bg-white/15 px-4 py-3 font-medium"
          >
            Orders
          </Link>
        </nav>

        <button
          onClick={() => {
            adminLogout();
            navigate("/admin/login", { replace: true });
          }}
          className="mt-auto hidden rounded-lg border border-white/20 px-4 py-3 text-left text-white/80 transition hover:bg-red-500 md:block"
        >
          <span className="flex items-center gap-2">
            <LogOut size={18} />
            Logout
          </span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#173f32]">Orders</h2>

            <p className="mt-2 text-gray-500">
              Manage customer orders and track their progress.
            </p>
          </div>

          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#e9e1d2] bg-white px-5 py-3 font-semibold text-[#173f32] transition hover:bg-[#faf9f5] disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </header>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Orders",
              value: stats.total,
              icon: ShoppingBag,
            },
            {
              title: "New Orders",
              value: stats.new,
              icon: Package,
            },
            {
              title: "Processing",
              value: stats.processing,
              icon: RefreshCw,
            },
            {
              title: "Delivered",
              value: stats.delivered,
              icon: ClipboardList,
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-[#e9e1d2] bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf2ed] text-[#173f32]">
                  <Icon size={21} />
                </div>

                <p className="text-sm text-gray-500">{stat.title}</p>

                <h3 className="mt-3 text-3xl font-bold text-[#173f32]">
                  {stat.value}
                </h3>
              </div>
            );
          })}
        </section>

        {/* Orders Table */}
        <section className="overflow-hidden rounded-2xl border border-[#e9e1d2] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
            <h3 className="text-xl font-bold text-[#173f32]">All Orders</h3>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 outline-none transition focus:border-[#1b9c85] sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 outline-none focus:border-[#1b9c85]"
              >
                <option value="all">All Statuses</option>

                {ORDER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#173f32] border-t-transparent" />

                <p className="mt-4 text-[#173f32]">Loading orders...</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-[#173f32]">
                No orders found
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Try another search or status filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#faf9f5] text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Order</th>
                    <th className="px-5 py-4 font-medium">Customer</th>
                    <th className="px-5 py-4 font-medium">Date</th>
                    <th className="px-5 py-4 font-medium">Total</th>
                    <th className="px-5 py-4 font-medium">Payment</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t border-gray-100 transition hover:bg-[#faf9f5]"
                    >
                      <td className="px-5 py-4 font-semibold text-[#173f32]">
                        #{order.order_no || order.id}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-[#173f32]">
                          {order.customer_name || "—"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.phone || "—"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-[#173f32]">
                        {formatPrice(order.total)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold capitalize text-gray-600">
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-2 rounded-lg bg-[#eaf2ed] px-3 py-2 text-sm font-medium text-[#173f32] transition hover:bg-[#d8e8dd]"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredOrders.length > 0 && (
            <div className="border-t px-5 py-4 text-sm text-gray-400">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          )}
        </section>
      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e9e1d2] p-6">
              <div>
                <h2 className="text-2xl font-bold text-[#173f32]">
                  Order #{selectedOrder.order_no || selectedOrder.id}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl text-gray-400 transition hover:text-red-500"
              >
                <X size={23} />
              </button>
            </div>

            <div className="max-h-[65vh] space-y-6 overflow-y-auto p-6">
              {/* Customer Information */}
              <section>
                <h3 className="mb-4 text-lg font-bold text-[#173f32]">
                  Customer Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <User size={19} className="mt-1 text-[#1b9c85]" />

                    <div>
                      <p className="text-xs text-gray-400">Customer</p>
                      <p className="font-semibold text-gray-700">
                        {selectedOrder.customer_name || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone size={19} className="mt-1 text-[#1b9c85]" />

                    <div>
                      <p className="text-xs text-gray-400">Phone</p>
                      <p className="font-semibold text-gray-700">
                        {selectedOrder.phone || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin size={19} className="mt-1 text-[#1b9c85]" />

                    <div>
                      <p className="text-xs text-gray-400">Address</p>
                      <p className="font-semibold text-gray-700">
                        {selectedOrder.address || "—"}
                      </p>
                    </div>
                  </div>

                  {selectedOrder.email && (
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <User size={19} className="mt-1 text-[#1b9c85]" />

                      <div>
                        <p className="text-xs text-gray-400">Email</p>
                        <p className="font-semibold text-gray-700">
                          {selectedOrder.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Products */}
              <section>
                <h3 className="mb-4 text-lg font-bold text-[#173f32]">
                  Ordered Products
                </h3>

                {selectedOrder.items.length === 0 ? (
                  <p className="rounded-xl bg-[#faf9f5] p-4 text-sm text-gray-500">
                    No product details available.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={`${item.name || "product"}-${index}`}
                        className="flex items-center justify-between rounded-xl bg-[#faf9f5] p-4"
                      >
                        <div>
                          <p className="font-semibold text-[#173f32]">
                            {item.name || "Product"}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Quantity: {Number(item.qty || 0)}
                          </p>
                        </div>

                        <p className="font-semibold text-[#173f32]">
                          {formatPrice(
                            Number(item.price || 0) * Number(item.qty || 0),
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-[#e9e1d2] pt-4">
                  <span className="font-bold text-gray-700">Total</span>

                  <span className="text-xl font-bold text-[#173f32]">
                    {formatPrice(selectedOrder.total)}
                  </span>
                </div>
              </section>

              {/* Order Status */}
              <section className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Order Status
                  </label>

                  <select
                    value={selectedOrder.status}
                    disabled={updating}
                    onChange={(e) => updateOrder({ status: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#1b9c85] disabled:opacity-50"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Status
                  </label>

                  <select
                    value={selectedOrder.payment_status}
                    disabled={updating}
                    onChange={(e) =>
                      updateOrder({ payment_status: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-[#1b9c85] disabled:opacity-50"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Payment Method */}
              <section className="rounded-xl bg-[#faf9f5] p-4">
                <div className="mb-2 flex items-center gap-2 font-semibold text-[#173f32]">
                  <CreditCard size={18} />
                  Payment Method
                </div>

                <p className="text-sm capitalize text-gray-500">
                  {selectedOrder.payment_method || "—"}
                </p>
              </section>

              {selectedOrder.notes && (
                <section>
                  <h3 className="mb-2 font-bold text-[#173f32]">Notes</h3>

                  <p className="rounded-xl bg-[#faf9f5] p-4 text-sm text-gray-600">
                    {selectedOrder.notes}
                  </p>
                </section>
              )}
            </div>

            <div className="border-t border-[#e9e1d2] p-5">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-lg bg-[#173f32] py-3 font-semibold text-white transition hover:bg-[#1b9c85]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
