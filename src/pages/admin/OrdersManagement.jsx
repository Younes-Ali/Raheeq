import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { adminLogout, adminRequest } from "../../api/admin";

import AdminHeader from "../../components/admin/layout/AdminHeader";

import OrdersTable from "../../components/admin/orders/OrdersTable";
import OrderDetailsModal from "../../components/admin/orders/OrderDetailsModal";

import LoadingState from "../../components/admin/shared/LoadingState";
import StatCard from "../../components/admin/shared/StatCard";

import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

const ORDER_STATUSES = [
  "new",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"];

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} EGP`;

export default function OrdersManagement() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const result = await adminRequest({
          action: "list",
          sheet: "orders",
        });

        const normalizedOrders = Array.isArray(result) ? result : [];

        normalizedOrders.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        setOrders(normalizedOrders);

        setSelectedOrder((previous) => {
          if (!previous) return null;

          return (
            normalizedOrders.find(
              (order) => String(order.id) === String(previous.id),
            ) || null
          );
        });
      } catch (error) {
        toast.error("Failed to load orders");

        if (
          error.message === "unauthorized" ||
          error.message === "session_expired"
        ) {
          adminLogout();
          navigate("/admin/login", { replace: true });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [
          order.order_no,
          order.id,
          order.customer_name,
          order.phone,
          order.email,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        statusFilter === "all" ||
        String(order.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const pendingCount = orders.filter((order) =>
    ["new", "confirmed", "processing"].includes(
      String(order.status || "").toLowerCase(),
    ),
  ).length;

  const deliveredCount = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "delivered",
  ).length;

  const cancelledCount = orders.filter(
    (order) => String(order.status || "").toLowerCase() === "cancelled",
  ).length;

  const totalRevenue = orders
    .filter(
      (order) =>
        String(order.status || "").toLowerCase() === "delivered" &&
        String(order.payment_status || "").toLowerCase() === "paid",
    )
    .reduce((total, order) => total + Number(order.total || 0), 0);

  async function updateOrder(updatedFields) {
    if (!selectedOrder || saving) return;

    const updatedOrder = {
      ...selectedOrder,
      ...updatedFields,
      updated_at: new Date().toISOString(),
    };

    try {
      setSaving(true);

      await adminRequest({
        action: "upsert",
        sheet: "orders",
        record: updatedOrder,
      });

      setOrders((previous) =>
        previous.map((order) =>
          String(order.id) === String(updatedOrder.id) ? updatedOrder : order,
        ),
      );

      setSelectedOrder(updatedOrder);

      toast.success("Order updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteOrder(order) {
    const status = String(order.status || "").toLowerCase();

    if (!["delivered", "cancelled"].includes(status)) {
      toast.error("Only delivered or cancelled orders can be deleted");
      return;
    }

    const message =
      status === "delivered"
        ? `Delete order #${order.order_no || order.id}? It will first be archived to preserve sales history.`
        : `Delete cancelled order #${order.order_no || order.id}?`;

    const confirmed = window.confirm(message);

    if (!confirmed) return;

    try {
      setSaving(true);

      await adminRequest({
        action: "delete",
        sheet: "orders",
        id: order.id,
      });

      setOrders((previous) =>
        previous.filter((item) => String(item.id) !== String(order.id)),
      );

      setSelectedOrder(null);

      toast.success(
        status === "delivered"
          ? "Order archived and deleted successfully"
          : "Cancelled order deleted successfully",
      );
    } catch (error) {
      const messages = {
        order_cannot_be_deleted:
          "This order cannot be deleted in its current status.",
        order_not_found: "Order was not found.",
      };

      toast.error(
        messages[error.message] || error.message || "Failed to delete order",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader />

      <div className="space-y-6 p-5 sm:p-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingCart}
            color="#1b9c85"
          />

          <StatCard
            title="Pending Orders"
            value={pendingCount}
            icon={Clock}
            color="#e9b949"
          />

          <StatCard
            title="Delivered Orders"
            value={deliveredCount}
            icon={CheckCircle}
            color="#16a34a"
          />

          <StatCard
            title="Cancelled Orders"
            value={cancelledCount}
            icon={XCircle}
            color="#ef4444"
          />
        </section>

        <section className="rounded-2xl border border-[#e9e1d2] bg-white p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#173f32]">All Orders</h2>

              <p className="mt-1 text-sm text-gray-500">
                Search, filter and manage customer orders.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-[#173f32] transition hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div className="mb-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order number, customer or phone..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1b9c85]"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#1b9c85]"
            >
              <option value="all">All Statuses</option>

              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <LoadingState message="Loading orders..." />
          ) : (
            <>
              <OrdersTable orders={filteredOrders} onView={setSelectedOrder} />

              <div className="mt-4 border-t border-[#e9e1d2] pt-4 text-sm text-gray-400">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </>
          )}
        </section>

        <section className="rounded-2xl border border-[#e9e1d2] bg-white p-5">
          <p className="text-sm text-gray-500">
            Revenue from current delivered and paid orders
          </p>

          <h3 className="mt-2 text-2xl font-bold text-[#173f32]">
            {formatPrice(totalRevenue)}
          </h3>
        </section>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={updateOrder}
          onDelete={handleDeleteOrder}
          saving={saving}
        />
      )}
    </>
  );
}
