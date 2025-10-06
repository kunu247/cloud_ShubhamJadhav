// File name: Dashboard
// File name with extension: Dashboard.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\Dashboard.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useEffect, useState } from "react";
import SectionTitle from "../cart/SectionTitle";
import { customFetch, formatPrice } from "../../utils";

import { LuUsers } from "react-icons/lu";
import { FaShoppingBag, FaShoppingCart, FaRupeeSign } from "react-icons/fa";
import { RiGitRepositoryLine } from "react-icons/ri";
import { GoCodeSquare } from "react-icons/go";

import DetailsCard from "./DetailsCard";

/**
 * 🧭 Admin Dashboard
 * Shows summarized statistics (customers, products, orders, total sales)
 * Uses rich UI, animated cards, and dynamic icons.
 */
const Dashboard = () => {
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch summary data */
  const fetchDashboard = async () => {
    try {
      const response = await customFetch.get(`/customer/admin`);
      const data = response?.data?.data?.[0] || {};
      setDetails(data);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const newValue = (num) => {
    if (!num) return "₹0";
    let totalValue = formatPrice(num);
    totalValue = totalValue.substring(0, totalValue.length - 3);
    return totalValue;
  };

  const detailsArray = [
    {
      id: 1,
      value: details.customer,
      title: "Total Customers",
      icon: <LuUsers className="w-10 h-10" />,
      gradient: "from-pink-400 to-rose-500",
      color: "text-rose-900"
    },
    {
      id: 2,
      value: details.product,
      title: "Total Products",
      icon: <FaShoppingCart className="w-10 h-10" />,
      gradient: "from-cyan-400 to-sky-500",
      color: "text-sky-900"
    },
    {
      id: 3,
      value: details.payment,
      title: "Total Orders",
      icon: <FaShoppingBag className="w-10 h-10" />,
      gradient: "from-indigo-400 to-violet-500",
      color: "text-indigo-900"
    },
    {
      id: 4,
      value: newValue(details.total),
      title: "Total Sales",
      icon: <FaRupeeSign className="w-10 h-10" />,
      gradient: "from-amber-300 to-yellow-400",
      color: "text-yellow-700"
    },
    {
      id: 5,
      value: "Active",
      title: "Repository Status",
      icon: <RiGitRepositoryLine className="w-10 h-10" />,
      gradient: "from-emerald-400 to-green-500",
      color: "text-green-900"
    },
    {
      id: 6,
      value: "v2.0.0",
      title: "Build Version",
      icon: <GoCodeSquare className="w-10 h-10" />,
      gradient: "from-gray-400 to-slate-500",
      color: "text-slate-800"
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* 🌟 Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Manage your store, customers, and orders efficiently.
        </p>
      </div>

      {/* 📊 Section title */}
      <SectionTitle text={"Overall Statistics"} />

      {/* 💎 Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mt-10">
        {detailsArray.map(({ id, value, title, icon, gradient, color }) => (
          <div
            key={id}
            className={`group relative rounded-2xl shadow-md hover:shadow-xl p-6 cursor-pointer bg-gradient-to-br ${gradient} transition-all duration-300 transform hover:-translate-y-2`}
          >
            <div className="absolute inset-0 bg-white opacity-70 rounded-2xl backdrop-blur-sm"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`p-4 rounded-full bg-white/80 mb-4 ${color}`}>
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{value ?? 0}</h3>
              <p className="text-sm font-medium text-gray-700 mt-1">{title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Footer */}
      <div className="text-center mt-14 text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} Footware Management Software v2.0.0 —{" "}
          <span className="font-medium text-indigo-600">
            Shubham Jadhav Developer Suite
          </span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
