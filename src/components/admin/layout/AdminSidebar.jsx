import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingBag, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { adminLogout } from "../../../api/admin";

const navItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    adminLogout();
    navigate("/admin/login", { replace: true });
    toast.success("Logged out successfully");
  }

  return (
    <aside className="flex w-full flex-col justify-between bg-[#173f32] p-5 text-white lg:fixed lg:h-screen lg:w-64">
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold">
            Raheeq<span className="text-[#e9b949]">.</span>
          </h1>
          <p className="mt-1 text-sm text-white/60">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ title, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-white/15 font-semibold text-white"
                    : "text-white/75 hover:bg-white/10"
                }`
              }
            >
              <Icon size={19} />
              {title}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-8 flex items-center gap-3 rounded-xl px-4 py-3 text-red-200 transition hover:bg-white/10"
      >
        <LogOut size={19} />
        Logout
      </button>
    </aside>
  );
}
