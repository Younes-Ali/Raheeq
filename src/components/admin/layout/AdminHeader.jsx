import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin": {
    title: "Dashboard Overview",
    description: "Welcome back! Here's what's happening with your store.",
  },
  "/admin/products": {
    title: "Products Management",
    description: "Manage your store inventory and products.",
  },
  "/admin/orders": {
    title: "Orders Management",
    description: "Manage and track your customer orders.",
  },
};

export default function AdminHeader({ actions }) {
  const { pathname } = useLocation();

  const page = pageTitles[pathname] || pageTitles["/admin"];

  return (
    <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-bold text-[#173f32]">{page.title}</h2>

        <p className="mt-1 text-sm text-gray-500">{page.description}</p>
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      )}
    </header>
  );
}
