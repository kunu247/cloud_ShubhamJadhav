// File name: AdminOrders
// File name with extension: AdminOrders.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AdminOrders.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import day from "dayjs";
// import { FaFileInvoice, FaEye, FaTimes } from "react-icons/fa";
import { FaEye, FaTimes } from "react-icons/fa";

const STORAGE_KEYS = {
  ORDERS: "orders",
  PRODUCTS: "admin_products",
  CUSTOMERS: "local_customers"
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [limit, setLimit] = useState({ lower: 0, upper: 10 });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const [receiptData, setReceiptData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    address: "",
    order_items: [{ product_id: "", quantity: 1, rate: 0, discount: 0 }],
    total_amount: 0,
    payment_date: day().format("YYYY-MM-DD"),
    status: "pending"
  });

  // Load data from localStorage
  const loadOrders = () => {
    setLoading(true);
    const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || "[]");
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const loadProducts = () => {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
    );
    setProducts(Array.isArray(stored) ? stored : []);
  };

  const loadCustomers = () => {
    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.CUSTOMERS) || "[]"
    );
    setCustomers(Array.isArray(stored) ? stored : []);
  };

  const saveOrders = (updated) => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    setOrders(updated);
  };

  // Calculate total amount
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      const itemTotal = item.rate * item.quantity * (1 - item.discount / 100);
      return total + itemTotal;
    }, 0);
  };

  // Update rate when product is selected
  const updateProductRate = (index, productId) => {
    const product = products.find((p) => p.id == productId);
    if (product) {
      const updatedItems = [...form.order_items];
      updatedItems[index] = {
        ...updatedItems[index],
        product_id: productId,
        rate: parseFloat(product.cost) || 0
      };
      setForm({
        ...form,
        order_items: updatedItems,
        total_amount: calculateTotal(updatedItems)
      });
    }
  };

  // Update item quantity, rate, or discount
  const updateOrderItem = (index, field, value) => {
    const updatedItems = [...form.order_items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]:
        field === "quantity"
          ? parseInt(value) || 0
          : field === "discount"
          ? Math.min(100, Math.max(0, parseFloat(value) || 0))
          : parseFloat(value) || 0
    };

    setForm({
      ...form,
      order_items: updatedItems,
      total_amount: calculateTotal(updatedItems)
    });
  };

  // Add new product row
  const addProductRow = () => {
    setForm({
      ...form,
      order_items: [
        ...form.order_items,
        { product_id: "", quantity: 1, rate: 0, discount: 0 }
      ]
    });
  };

  // Remove product row
  const removeProductRow = (index) => {
    if (form.order_items.length > 1) {
      const updatedItems = form.order_items.filter((_, i) => i !== index);
      setForm({
        ...form,
        order_items: updatedItems,
        total_amount: calculateTotal(updatedItems)
      });
    }
  };

  // Generate receipt
  const generateReceipt = (order) => {
    const customer = customers.find((c) => c.id == order.customer_id);
    const orderWithDetails = {
      ...order,
      customer: customer || {
        name: "Unknown Customer",
        email: "",
        phone_number: ""
      },
      items: order.order_items.map((item) => {
        const product = products.find((p) => p.id == item.product_id);
        return {
          ...item,
          product: product || { product_name: "Unknown Product", image: "" },
          item_total: item.rate * item.quantity * (1 - item.discount / 100)
        };
      })
    };
    setReceiptData(orderWithDetails);
    setShowReceipt(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.customer_id ||
      !form.address ||
      form.order_items.some((item) => !item.product_id)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (form.total_amount <= 0) {
      toast.error("Order total must be greater than 0");
      return;
    }

    let updated = [...orders];

    if (editing) {
      updated = updated.map((o) =>
        o.payment_id === editing
          ? {
              ...form,
              payment_id: editing,
              total_amount: parseFloat(form.total_amount.toFixed(2))
            }
          : o
      );
      toast.success("Order updated successfully");
      setEditing(null);
    } else {
      const newOrder = {
        payment_id: Date.now(),
        ...form,
        total_amount: parseFloat(form.total_amount.toFixed(2)),
        created_at: day().format("YYYY-MM-DD HH:mm:ss")
      };
      updated.push(newOrder);
      toast.success("Order added successfully");
    }

    saveOrders(updated);
    resetForm();
    setActiveTab("list");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const updated = orders.filter((o) => o.payment_id !== id);
      saveOrders(updated);
      toast.info("Order deleted successfully");
    }
  };

  const handleEdit = (order) => {
    setForm(order);
    setEditing(order.payment_id);
    setActiveTab("form");
  };

  const resetForm = () => {
    setForm({
      customer_id: "",
      address: "",
      order_items: [{ product_id: "", quantity: 1, rate: 0, discount: 0 }],
      total_amount: 0,
      payment_date: day().format("YYYY-MM-DD"),
      status: "pending"
    });
    setEditing(null);
  };

  useEffect(() => {
    loadOrders();
    loadProducts();
    loadCustomers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    );
  }

  const pageCount = Math.ceil(orders.length / 10);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-primary">
          Orders Management ({orders.length})
        </h4>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === "list" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Order List
        </button>
        <button
          className={`tab ${activeTab === "form" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("form")}
        >
          {editing ? "Edit Order" : "Create New Order"}
        </button>
      </div>

      {/* Order Form Tab */}
      {activeTab === "form" && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-xl shadow-md p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="select select-bordered w-full"
              value={form.customer_id}
              onChange={(e) =>
                setForm({ ...form, customer_id: e.target.value })
              }
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.email}
                </option>
              ))}
            </select>

            <input
              className="input input-bordered"
              type="date"
              value={form.payment_date}
              onChange={(e) =>
                setForm({ ...form, payment_date: e.target.value })
              }
              required
            />
          </div>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Shipping Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
            rows={3}
          />

          {/* Order Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="font-semibold">Order Items</h5>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={addProductRow}
              >
                Add Product
              </button>
            </div>

            {form.order_items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 items-center p-3 bg-base-100 rounded-lg"
              >
                <div className="col-span-4">
                  <select
                    className="select select-bordered w-full"
                    value={item.product_id}
                    onChange={(e) => updateProductRate(index, e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.product_name} - ₹{p.cost}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  className="input input-bordered col-span-2"
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateOrderItem(index, "quantity", e.target.value)
                  }
                  min="1"
                  required
                />

                <input
                  className="input input-bordered col-span-2"
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) =>
                    updateOrderItem(index, "rate", e.target.value)
                  }
                  min="0"
                  step="0.01"
                  required
                />

                <input
                  className="input input-bordered col-span-2"
                  type="number"
                  placeholder="Discount %"
                  value={item.discount}
                  onChange={(e) =>
                    updateOrderItem(index, "discount", e.target.value)
                  }
                  min="0"
                  max="100"
                  step="0.1"
                />

                <div className="col-span-1 text-right font-semibold">
                  ₹
                  {(
                    item.rate *
                    item.quantity *
                    (1 - item.discount / 100)
                  ).toFixed(2)}
                </div>

                <div className="col-span-1">
                  {form.order_items.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-xs btn-error"
                      onClick={() => removeProductRow(index)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-primary text-primary-content p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Total Amount:</span>
              <span className="text-2xl font-bold">
                ₹{form.total_amount.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn btn-primary flex-1">
              {editing ? "Update Order" : "Create Order"}
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

      {/* Order List Tab */}
      {activeTab === "list" && (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow-sm">
            <table className="table table-zebra w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(limit.lower, limit.upper).map((order) => {
                  const customer = customers.find(
                    (c) => c.id == order.customer_id
                  );
                  return (
                    <tr key={order.payment_id}>
                      <td className="font-mono">#{order.payment_id}</td>
                      <td>{customer?.name || "Unknown"}</td>
                      <td>{order.order_items?.length || 0} items</td>
                      <td className="font-semibold text-success">
                        ₹{order.total_amount?.toFixed(2)}
                      </td>
                      <td>{day(order.payment_date).format("MMM D, YYYY")}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.status === "completed"
                              ? "badge-success"
                              : order.status === "pending"
                              ? "badge-warning"
                              : "badge-error"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-xs btn-info text-white"
                          onClick={() => generateReceipt(order)}
                          title="View Receipt"
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-xs btn-accent text-white"
                          onClick={() => handleEdit(order)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error text-white"
                          onClick={() => handleDelete(order.payment_id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-400 py-6">
                      No orders found. Create your first order!
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
              disabled={limit.upper >= orders.length}
              onClick={() => {
                if (limit.upper >= orders.length) {
                  toast.info("No more orders");
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

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Order Receipt</h3>
              <button
                className="btn btn-sm btn-circle"
                onClick={() => setShowReceipt(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="bg-base-200 p-6 rounded-lg space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
                  <p className="text-sm">Order #: {receiptData.payment_id}</p>
                  <p className="text-sm">
                    Date: {day(receiptData.payment_date).format("MMMM D, YYYY")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">Footwear Store</p>
                  <p className="text-sm">123 Fashion Street</p>
                  <p className="text-sm">Mumbai, India</p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Bill To:</h4>
                  <p>{receiptData.customer.name}</p>
                  <p>{receiptData.customer.email}</p>
                  <p>{receiptData.customer.phone_number}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Shipping Address:</h4>
                  <p>{receiptData.address}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Image</th>
                      <th>Rate</th>
                      <th>Qty</th>
                      <th>Discount</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receiptData.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.product.product_name}</td>
                        <td>
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.product_name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs">
                              No Image
                            </div>
                          )}
                        </td>
                        <td>₹{item.rate.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>{item.discount}%</td>
                        <td>₹{item.item_total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="border-t pt-4 text-right">
                <div className="text-2xl font-bold text-success">
                  Total: ₹{receiptData.total_amount.toFixed(2)}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-gray-500 mt-6">
                <p>Thank you for your business!</p>
                <p>For queries, contact: support@footwearstore.com</p>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                Print Receipt
              </button>
              <button className="btn" onClick={() => setShowReceipt(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
