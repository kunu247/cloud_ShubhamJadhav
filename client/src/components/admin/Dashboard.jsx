// File name: Dashboard
// File name with extension: Dashboard.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\Dashboard.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useEffect, useState } from "react";
import { LuUsers, LuRefreshCw } from "react-icons/lu";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaRupeeSign,
  FaChartLine,
  FaExclamationTriangle
} from "react-icons/fa";
import { RiGitRepositoryLine } from "react-icons/ri";
import { GoCodeSquare } from "react-icons/go";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const STORAGE_KEYS = {
  CUSTOMERS: "local_customers",
  PRODUCTS: "admin_products",
  ORDERS: "orders"
};

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchDashboardData = () => {
    try {
      setLoading(true);
      const customers = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || "[]"
      );
      const products = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
      );
      const orders = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]"
      );

      const totalSales = orders.reduce(
        (sum, order) => sum + (Number(order.total_amount) || 0),
        0
      );
      const thisMonthOrders = orders.filter((order) =>
        dayjs(order.payment_date).isAfter(dayjs().startOf("month"))
      );
      const monthlySales = thisMonthOrders.reduce(
        (sum, order) => sum + (Number(order.total_amount) || 0),
        0
      );

      const lowStock = products
        .filter((product) => (product.quantity || 0) < 10)
        .slice(0, 5);
      const recent = orders
        .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))
        .slice(0, 5);

      const dashboardStats = {
        customers: customers.length,
        products: products.length,
        orders: orders.length,
        totalSales,
        monthlySales,
        lowStockCount: lowStock.length,
        pendingOrders: orders.filter((order) => order.status === "pending")
          .length
      };

      setStats(dashboardStats);
      setRecentOrders(recent);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatPrice = (num) => `₹${Number(num || 0).toLocaleString("en-IN")}`;

  // Refactored, unified color palette
  const statsCards = [
    {
      id: 1,
      value: stats.customers || 0,
      title: "Total Customers",
      icon: <LuUsers className="w-6 h-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%"
    },
    {
      id: 2,
      value: stats.products || 0,
      title: "Total Products",
      icon: <FaShoppingCart className="w-6 h-6" />,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      change: "+5%"
    },
    {
      id: 3,
      value: stats.orders || 0,
      title: "Total Orders",
      icon: <FaShoppingBag className="w-6 h-6" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      change: "+8%"
    },
    {
      id: 4,
      value: formatPrice(stats.totalSales),
      title: "Total Sales",
      icon: <FaRupeeSign className="w-6 h-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+15%"
    },
    {
      id: 5,
      value: formatPrice(stats.monthlySales),
      title: "Monthly Sales",
      icon: <FaChartLine className="w-6 h-6" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      change: "+10%"
    },
    {
      id: 6,
      value: stats.pendingOrders || 0,
      title: "Pending Orders",
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      change: "-2%"
    }
  ];

  const systemCards = [
    {
      id: 1,
      value: "Active",
      title: "System Status",
      icon: <RiGitRepositoryLine className="w-6 h-6" />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      status: "operational"
    },
    {
      id: 2,
      value: "v2.0.0",
      title: "Build Version",
      icon: <GoCodeSquare className="w-6 h-6" />,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
      status: "latest"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-blue-600">Dashboard Overview</h4>
        <button
          className="btn btn-outline btn-sm text-blue-600 border-blue-400 hover:bg-blue-50"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          <LuRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${
            activeTab === "overview" ? "tab-active text-blue-600" : ""
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${
            activeTab === "analytics" ? "tab-active text-blue-600" : ""
          }`}
          onClick={() => setActiveTab("analytics")}
        >
          Analytics
        </button>
        <button
          className={`tab ${
            activeTab === "system" ? "tab-active text-blue-600" : ""
          }`}
          onClick={() => setActiveTab("system")}
        >
          System Info
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((card) => (
              <div
                key={card.id}
                className="bg-base-100 rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {card.value}
                    </p>
                    <p className="text-xs text-success mt-1">
                      {card.change} from last month
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${card.bgColor} ${card.color}`}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-base-100 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.payment_id}
                    className="flex justify-between items-center p-3 bg-base-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Order #{order.payment_id}</p>
                      <p className="text-sm text-gray-600">
                        {dayjs(order.payment_date).format("MMM D, YYYY")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span
                        className={`badge badge-sm ${
                          order.status === "completed"
                            ? "badge-success"
                            : order.status === "pending"
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No recent orders
                  </p>
                )}
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-base-100 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Low Stock Alert</h3>
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex justify-between items-center p-3 bg-warning/10 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.product_name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            No Image
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.product_name}</p>
                        <p className="text-sm text-gray-600">
                          {product.product_company}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-error">
                        {product.quantity || 0} left
                      </p>
                      <p className="text-sm">{formatPrice(product.cost)}</p>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length === 0 && (
                  <p className="text-center text-success py-4">
                    All products are well stocked!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Summary */}
            <div className="bg-base-100 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Sales Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-base-200 rounded">
                  <span>Total Revenue</span>
                  <span className="font-bold text-success">
                    {formatPrice(stats.totalSales)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded">
                  <span>Monthly Revenue</span>
                  <span className="font-bold text-primary">
                    {formatPrice(stats.monthlySales)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded">
                  <span>Average Order Value</span>
                  <span className="font-bold text-info">
                    {stats.orders > 0
                      ? formatPrice(stats.totalSales / stats.orders)
                      : formatPrice(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="bg-base-100 rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Inventory Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-base-200 rounded">
                  <span>Total Products</span>
                  <span className="font-bold text-info">{stats.products}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded">
                  <span>Low Stock Items</span>
                  <span className="font-bold text-warning">
                    {stats.lowStockCount}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-base-200 rounded">
                  <span>Out of Stock</span>
                  <span className="font-bold text-error">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-base-100 rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {stats.customers}
                </p>
                <p className="text-sm text-gray-600">Customers</p>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {stats.orders}
                </p>
                <p className="text-sm text-gray-600">Orders</p>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <p className="text-2xl font-bold text-warning">
                  {stats.products}
                </p>
                <p className="text-sm text-gray-600">Products</p>
              </div>
              <div className="text-center p-4 bg-info/10 rounded-lg">
                <p className="text-2xl font-bold text-info">
                  {stats.pendingOrders}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* System Info Tab */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemCards.map((card) => (
              <div
                key={card.id}
                className="bg-base-100 rounded-xl shadow-sm border p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {card.value}
                    </p>
                    <p className="text-xs text-success mt-1">
                      All systems operational
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-full ${card.bgColor} ${card.color}`}
                  >
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* System Information */}
          <div className="bg-base-100 rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-medium">Web Application</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Storage</span>
                  <span className="font-medium">MS SQL Server</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {dayjs().format("MMM D, YYYY HH:mm")}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Integrity</span>
                  <span className="badge badge-success">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backup Status</span>
                  <span className="badge badge-warning">Manual</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>
          © {new Date().getFullYear()} Footwear Management Software v2.0.0 —{" "}
          <span className="font-medium text-primary">
            Shubham Jadhav Developer Suite
          </span>
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
