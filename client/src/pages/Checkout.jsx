// File name: Checkout
// File name with extension: Checkout.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Checkout.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import React from "react";

const AdminPanel = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-shrink-0 w-64 bg-gray-800">
        {/* Sidebar */}
        <div className="h-full py-4 flex flex-col justify-between">
          {/* Logo */}
          <div className="px-4">
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
          </div>
          {/* Navigation */}
          <nav className="mt-6">
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-gray-700"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-gray-700"
            >
              Products
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-gray-700"
            >
              Orders
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-white hover:bg-gray-700"
            >
              Customers
            </a>
          </nav>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Content */}
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Welcome to the Admin Panel!</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
