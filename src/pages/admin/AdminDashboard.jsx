import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { adminLogout, adminRequest } from "../../api/admin";

import AdminHeader from "../../components/admin/layout/AdminHeader";

import StatCard from "../../components/admin/shared/StatCard";
import LoadingState from "../../components/admin/shared/LoadingState";

import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import OrdersChart from "../../components/admin/dashboard/OrdersChart";
import OrdersStatusChart from "../../components/admin/dashboard/OrdersStatusChart";
import TopProducts from "../../components/admin/dashboard/TopProducts";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";

import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  Users,
  RefreshCw,
} from "lucide-react";

const PERIODS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
  { label: "All Time", value: "all" },
];

const formatPrice = (value) =>
  `${Number(value || 0).toLocaleString("en-US")} EGP`;

function getLocalDateKey(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateFromPeriod(period) {
  if (period === "all") return null;

  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - Number(period) + 1);

  return date;
}

function isWithinPeriod(dateValue, period) {
  if (period === "all") return true;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return false;

  const startDate = getDateFromPeriod(period);

  return date >= startDate;
}

function getUniqueOrders(orders = []) {
  const map = new Map();

  orders.forEach((order) => {
    const key = String(order.id || order.order_no || "");

    if (key && !map.has(key)) {
      map.set(key, order);
    }
  });

  return Array.from(map.values());
}

function parseItems(items) {
  if (Array.isArray(items)) return items;

  try {
    return JSON.parse(items || "[]");
  } catch {
    return [];
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    products: [],
    orders: [],
    clients: [],
    sales_archive: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("30");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const result = await adminRequest({
          action: "snapshot",
        });

        setData({
          products: result.products || [],
          orders: result.orders || [],
          clients: result.clients || [],
          sales_archive: result.sales_archive || [],
        });

        setLastUpdated(new Date());
      } catch (error) {
        toast.error("Failed to load dashboard data");

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
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredOrders = useMemo(() => {
    return data.orders.filter((order) =>
      isWithinPeriod(order.created_at, period),
    );
  }, [data.orders, period]);

  const revenueOrders = useMemo(() => {
    const allOrders = getUniqueOrders([...data.orders, ...data.sales_archive]);

    return allOrders.filter((order) => {
      const isDelivered =
        String(order.status || "").toLowerCase() === "delivered";

      const isPaid =
        String(order.payment_status || "").toLowerCase() === "paid";

      return isDelivered && isPaid && isWithinPeriod(order.created_at, period);
    });
  }, [data.orders, data.sales_archive, period]);

  const activeProducts = useMemo(() => {
    return data.products.filter(
      (product) => String(product.is_active).toLowerCase() === "true",
    ).length;
  }, [data.products]);

  const outOfStock = useMemo(() => {
    return data.products.filter((product) => Number(product.stock) <= 0).length;
  }, [data.products]);

  const pendingOrders = useMemo(() => {
    return filteredOrders.filter((order) =>
      ["new", "confirmed", "processing"].includes(
        String(order.status || "").toLowerCase(),
      ),
    ).length;
  }, [filteredOrders]);

  const deliveredOrders = useMemo(() => {
    return filteredOrders.filter(
      (order) => String(order.status || "").toLowerCase() === "delivered",
    ).length;
  }, [filteredOrders]);

  const totalRevenue = useMemo(() => {
    return revenueOrders.reduce(
      (total, order) => total + Number(order.total || 0),
      0,
    );
  }, [revenueOrders]);

  const totalOrders = filteredOrders.length;

  const statusChartData = useMemo(() => {
    const statuses = [
      "new",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    return statuses.map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: filteredOrders.filter(
        (order) => String(order.status || "").toLowerCase() === status,
      ).length,
    }));
  }, [filteredOrders]);

  const salesChartData = useMemo(() => {
    const grouped = {};

    revenueOrders.forEach((order) => {
      const date = getLocalDateKey(order.created_at);

      if (!date) return;

      grouped[date] = (grouped[date] || 0) + Number(order.total || 0);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({
        date,
        revenue,
      }));
  }, [revenueOrders]);

  const ordersChartData = useMemo(() => {
    const grouped = {};

    filteredOrders.forEach((order) => {
      const date = getLocalDateKey(order.created_at);

      if (!date) return;

      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, orders]) => ({
        date,
        orders,
      }));
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const grouped = {};

    const allOrders = getUniqueOrders([...data.orders, ...data.sales_archive]);

    allOrders.forEach((order) => {
      const isDelivered =
        String(order.status || "").toLowerCase() === "delivered";

      const isPaid =
        String(order.payment_status || "").toLowerCase() === "paid";

      if (
        !isDelivered ||
        !isPaid ||
        !isWithinPeriod(order.created_at, period)
      ) {
        return;
      }

      const items = parseItems(order.items);

      items.forEach((item) => {
        const name = item.name || item.product_name || "Unknown Product";
        const quantity = Number(item.qty || item.quantity || 1);
        const price = Number(item.price || 0);

        if (!grouped[name]) {
          grouped[name] = {
            id: name,
            name,
            quantity: 0,
            revenue: 0,
          };
        }

        grouped[name].quantity += quantity;
        grouped[name].revenue += quantity * price;
      });
    });

    return Object.values(grouped)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [data.orders, data.sales_archive, period]);

  const recentOrders = useMemo(() => {
    return [...data.orders]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [data.orders]);

  if (loading) {
    return (
      <>
        <AdminHeader />
        <div className="p-8">
          <LoadingState message="Loading dashboard..." />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader
        actions={
          <button
            type="button"
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#173f32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b9c85] disabled:opacity-60"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        }
      />

      <div className="space-y-6 p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#173f32]">Store Overview</h2>

            <p className="mt-1 text-sm text-gray-500">
              Track your store performance and activity.
            </p>

            {lastUpdated && (
              <p className="mt-1 text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl border border-[#e9e1d2] bg-white px-4 py-3 text-sm text-[#173f32] outline-none focus:border-[#1b9c85]"
          >
            {PERIODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={data.products.length}
            icon={Package}
            color="#1b9c85"
            description={`${activeProducts} active products`}
          />

          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingCart}
            color="#3b82f6"
            description="Current orders in selected period"
          />

          <StatCard
            title="Total Revenue"
            value={formatPrice(totalRevenue)}
            icon={DollarSign}
            color="#e9b949"
            description="Paid and delivered orders, including archive"
          />

          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={Clock}
            color="#f59e0b"
            description="New, confirmed and processing"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Delivered Orders"
            value={deliveredOrders}
            icon={CheckCircle}
            color="#16a34a"
          />

          <StatCard
            title="Out of Stock"
            value={outOfStock}
            icon={Package}
            color="#ef4444"
          />

          <StatCard
            title="Clients"
            value={data.clients.length}
            icon={Users}
            color="#8b5cf6"
          />

          <StatCard
            title="Archived Sales"
            value={data.sales_archive.length}
            icon={DollarSign}
            color="#b7791f"
            description="Historical orders preserved"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <RevenueChart data={salesChartData} />
          <OrdersChart data={ordersChartData} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <OrdersStatusChart data={statusChartData} />
          <TopProducts products={topProducts} />
        </section>

        <RecentOrders orders={recentOrders} />
      </div>
    </>
  );
}
