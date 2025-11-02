// File name: AdminCustomers
// File name with extension: AdminCustomers.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AdminCustomers.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const STORAGE_KEY = "local_customers";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [limit, setLimit] = useState({ lower: 0, upper: 10 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  const [editing, setEditing] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    address: "",
    phone_number: "",
    pincode: "",
    join_date: new Date().toISOString().split("T")[0]
  });

  // Load customers from localStorage
  const loadCustomers = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      setCustomers(stored);
    } catch {
      toast.error("Corrupted customer data in local storage");
    }
  };

  // Save customers to localStorage
  const saveCustomers = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setCustomers(data);
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      email: "",
      address: "",
      phone_number: "",
      pincode: "",
      join_date: new Date().toISOString().split("T")[0]
    });
    setEditing(null);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email } = form;

    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    let updated;
    if (editing) {
      updated = customers.map((c) => (c.id === editing ? { ...form } : c));
      toast.success("Customer updated successfully");
    } else {
      const newCustomer = {
        ...form,
        id: Date.now(),
        created_at: new Date().toISOString()
      };
      updated = [...customers, newCustomer];
      toast.success("Customer added successfully");
    }

    saveCustomers(updated);
    resetForm();
    setActiveTab("list");
  };

  // Handle delete customer
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    const filtered = customers.filter((c) => c.id !== id);
    saveCustomers(filtered);
    toast.info("Customer deleted successfully");
  };

  // Handle edit customer
  const handleEdit = (customer) => {
    setForm(customer);
    setEditing(customer.id);
    setActiveTab("form");
  };

  // View customer details
  const viewCustomerDetails = (customer) => {
    setCustomerDetails(customer);
    setShowDetails(true);
  };

  // Calculate customer statistics
  const getCustomerStats = () => {
    return {
      total: customers.length,
      recent: customers.filter((c) => {
        const joinDate = new Date(c.join_date || c.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return joinDate > thirtyDaysAgo;
      }).length
    };
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      loadCustomers();
      setLoading(false);
    }, 400);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    );
  }

  const stats = getCustomerStats();
  const pageCount = Math.ceil(customers.length / 10);

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-2xl font-bold text-primary">
            Customer Management ({customers.length})
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {stats.recent} new customers in last 30 days
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed bg-base-200 p-1 rounded-lg">
        <button
          className={`tab tab-lg flex-1 ${
            activeTab === "list"
              ? "tab-active bg-primary text-primary-content"
              : ""
          }`}
          onClick={() => setActiveTab("list")}
        >
          Customer List
        </button>
        <button
          className={`tab tab-lg flex-1 ${
            activeTab === "form"
              ? "tab-active bg-primary text-primary-content"
              : ""
          }`}
          onClick={() => {
            resetForm();
            setActiveTab("form");
          }}
        >
          {editing ? "Edit Customer" : "Add New Customer"}
        </button>
      </div>

      {/* Customer Form Tab */}
      {activeTab === "form" && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-xl shadow-md p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name *</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Email Address *
                </span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                className="input input-bordered w-full"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Phone Number</span>
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="input input-bordered w-full"
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Join Date</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full"
                value={form.join_date}
                onChange={(e) =>
                  setForm({ ...form, join_date: e.target.value })
                }
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold">Address</span>
              </label>
              <textarea
                placeholder="Enter complete address"
                className="textarea textarea-bordered w-full"
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Pincode</span>
              </label>
              <input
                type="text"
                placeholder="Enter pincode"
                className="input input-bordered w-full"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary flex-1">
              {editing ? "Update Customer" : "Add Customer"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                resetForm();
                setActiveTab("list");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Customer List Tab */}
      {activeTab === "list" && (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow-sm">
            <table className="table table-zebra w-full">
              <thead className="bg-primary text-primary-content">
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(limit.lower, limit.upper).map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-base-200 transition-colors"
                  >
                    <td>
                      <div>
                        <div className="font-semibold">{customer.name}</div>
                        <div className="text-sm text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="text-sm">{customer.email}</div>
                        <div className="text-sm text-gray-600">
                          {customer.phone_number || "Not provided"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="max-w-xs">
                        <div className="text-sm line-clamp-2">
                          {customer.address || "Not provided"}
                        </div>
                        {customer.pincode && (
                          <div className="text-sm text-gray-600">
                            Pincode: {customer.pincode}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {new Date(
                          customer.join_date || customer.created_at
                        ).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-xs btn-info text-white"
                          onClick={() => viewCustomerDetails(customer)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-xs btn-accent text-white"
                          onClick={() => handleEdit(customer)}
                          title="Edit Customer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => handleDelete(customer.id)}
                          title="Delete Customer"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-4xl mb-2">👥</div>
                        <p className="text-lg font-semibold">
                          No customers found
                        </p>
                        <p className="text-sm">
                          Get started by adding your first customer
                        </p>
                        <button
                          className="btn btn-primary btn-sm mt-4"
                          onClick={() => {
                            resetForm();
                            setActiveTab("form");
                          }}
                        >
                          Add First Customer
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center gap-4">
            <button
              className="btn btn-sm btn-outline"
              disabled={limit.lower === 0}
              onClick={() =>
                setLimit((p) => ({
                  lower: Math.max(0, p.lower - 10),
                  upper: Math.max(10, p.upper - 10)
                }))
              }
            >
              Previous
            </button>

            <button
              className="btn btn-sm btn-outline"
              disabled={limit.upper >= customers.length}
              onClick={() => {
                if (limit.upper >= customers.length) {
                  toast.info("No more customers");
                  return;
                }
                setLimit((p) => ({ lower: p.lower + 10, upper: p.upper + 10 }));
              }}
            >
              Next
            </button>

            <div className="ml-auto text-sm text-gray-500">
              Page {Math.floor(limit.lower / 10) + 1} of {pageCount || 1}
            </div>
          </div>
        </>
      )}

      {/* Customer Details Modal */}
      {showDetails && customerDetails && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Customer Details</h3>
              <button
                className="btn btn-sm btn-circle"
                onClick={() => setShowDetails(false)}
              >
                ✕
              </button>
            </div>

            <div className="bg-base-200 p-6 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Personal Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {customerDetails.name}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span>{" "}
                      {customerDetails.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {customerDetails.phone_number || "Not provided"}
                    </div>
                    <div>
                      <span className="font-medium">Join Date:</span>{" "}
                      {new Date(
                        customerDetails.join_date || customerDetails.created_at
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Address Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Address:</span>
                    </div>
                    <div className="text-sm bg-base-100 p-3 rounded">
                      {customerDetails.address || "Not provided"}
                    </div>
                    {customerDetails.pincode && (
                      <div>
                        <span className="font-medium">Pincode:</span>{" "}
                        {customerDetails.pincode}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-lg mb-2">Customer ID</h4>
                <div className="font-mono text-sm bg-base-100 p-2 rounded">
                  {customerDetails.id}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowDetails(false);
                  handleEdit(customerDetails);
                }}
              >
                Edit Customer
              </button>
              <button className="btn" onClick={() => setShowDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
