import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f5f1e8] lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-5 lg:ml-64 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
