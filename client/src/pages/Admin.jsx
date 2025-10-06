// File name: Admin
// File name with extension: Admin.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Admin.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useEffect } from "react";
import { useGlobalContext } from "../context";
import { toast } from "react-toastify";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BiSolidDashboard } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { FaShoppingBag, FaShoppingCart } from "react-icons/fa";

const Admin = () => {
  const { customer } = useGlobalContext();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const custLocal = JSON.parse(localStorage.getItem("customer")) || null;

      if (!custLocal) {
        toast.error("Please login to access Admin Panel");
        navigate("/");
        return;
      }

      if (custLocal.role !== "admin") {
        toast.error("Not authorized to access Admin Panel");
        navigate("/");
        return;
      }
    } catch (err) {
      console.error("Admin Auth Error:", err);
      toast.error("Session error. Please log in again.");
      localStorage.removeItem("customer");
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="flex-shrink-0 w-64 bg-base-300 shadow-lg">
        <div className="h-full py-6 flex flex-col">
          <div className="px-4 mb-4">
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `px-4 py-2 flex items-center gap-3 rounded-md ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <BiSolidDashboard /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/customer"
              className={({ isActive }) =>
                `px-4 py-2 flex items-center gap-3 rounded-md ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <LuUsers /> Customers
            </NavLink>

            <NavLink
              to="/admin/product"
              className={({ isActive }) =>
                `px-4 py-2 flex items-center gap-3 rounded-md ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <FaShoppingCart /> Products
            </NavLink>

            <NavLink
              to="/admin/order"
              className={({ isActive }) =>
                `px-4 py-2 flex items-center gap-3 rounded-md ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              <FaShoppingBag /> Orders
            </NavLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-neutral text-neutral-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
