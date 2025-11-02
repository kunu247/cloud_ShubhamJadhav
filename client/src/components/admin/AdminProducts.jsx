// File name: AdminProducts
// File name with extension: AdminProducts.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AdminProducts.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTimes } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const STORAGE_KEY = "admin_products";
const COMPANY_OPTIONS = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Levi's",
  "Zara",
  "H&M",
  "UCB"
];

const SIZE_OPTIONS = ["5", "6", "7", "8", "9", "10", "11", "S", "M", "L", "XL"];
const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "U", label: "Unisex" }
];

const generateProductId = () =>
  "P" + Math.floor(100000 + Math.random() * 900000);

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState("");
  const [activeTab, setActiveTab] = useState("list");
  const [showPreview, setShowPreview] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [limit, setLimit] = useState({ lower: 0, upper: 10 });
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    productId: generateProductId(),
    product_name: "",
    product_company: "",
    image: "",
    quantity: "",
    cost: "",
    gender: "",
    size: "",
    description: "",
    color: ""
  });

  const loadProducts = () => {
    setLoading(true);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setProducts(Array.isArray(stored) ? stored : []);
    setLoading(false);
  };

  const saveProducts = (updated) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProducts(updated);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product_name || !form.product_company || !form.cost) {
      toast.error("Product name, company, and cost are required");
      return;
    }

    const updatedList = [...products];
    if (editing) {
      const idx = updatedList.findIndex((p) => p.id === editing);
      updatedList[idx] = {
        ...form,
        id: editing,
        cost: Number(form.cost) || 0,
        quantity: Number(form.quantity) || 0
      };
      toast.success("Product updated successfully");
    } else {
      const newProduct = {
        ...form,
        id: Date.now(),
        cost: Number(form.cost) || 0,
        quantity: Number(form.quantity) || 0,
        created_at: new Date().toISOString()
      };
      updatedList.push(newProduct);
      toast.success("Product added successfully");
    }

    saveProducts(updatedList);
    resetForm();
    setActiveTab("list");
  };

  const handleEdit = (id) => {
    const prod = products.find((p) => p.id === id);
    if (prod) {
      setForm(prod);
      setEditing(id);
      setPreview(prod.image);
      setActiveTab("form");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const updated = products.filter((p) => p.id !== id);
      saveProducts(updated);
      toast.success("Product deleted successfully");
    }
  };

  const handlePreview = (product) => {
    setPreviewProduct(product);
    setShowPreview(true);
  };

  const resetForm = () => {
    setForm({
      id: "",
      productId: generateProductId(),
      product_name: "",
      product_company: "",
      image: "",
      quantity: "",
      cost: "",
      gender: "",
      size: "",
      description: "",
      color: ""
    });
    setEditing(null);
    setPreview("");
  };

  const formatPrice = (num) => `₹${Number(num).toFixed(2)}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    );
  }

  const pageCount = Math.ceil(products.length / 10);

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-2xl font-bold text-primary">
          Products Management ({products.length})
        </h4>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs tabs-boxed">
        <button
          className={`tab ${activeTab === "list" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Products List
        </button>
        <button
          className={`tab ${activeTab === "form" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("form")}
        >
          {editing ? "Edit Product" : "Add New Product"}
        </button>
      </div>

      {/* Product Form Tab */}
      {activeTab === "form" && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 rounded-xl shadow-md p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product ID Display */}
            <div className="col-span-full bg-base-100 p-3 rounded-lg">
              <label className="label">
                <span className="label-text font-semibold">Product ID</span>
              </label>
              <div className="font-mono text-lg text-primary">
                {form.productId}
              </div>
            </div>

            {/* Product Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Product Name *</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name"
                className="input input-bordered"
                value={form.product_name}
                onChange={(e) =>
                  setForm({ ...form, product_name: e.target.value })
                }
                required
              />
            </div>

            {/* Company */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Company *</span>
              </label>
              <select
                className="select select-bordered"
                value={form.product_company}
                onChange={(e) =>
                  setForm({ ...form, product_company: e.target.value })
                }
                required
              >
                <option value="">Select Company</option>
                {COMPANY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Price (₹) *</span>
              </label>
              <input
                type="number"
                placeholder="0.00"
                className="input input-bordered"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Quantity */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Quantity</span>
              </label>
              <input
                type="number"
                placeholder="0"
                className="input input-bordered"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min="0"
              />
            </div>

            {/* Gender */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Gender</span>
              </label>
              <select
                className="select select-bordered"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select Gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Size</span>
              </label>
              <select
                className="select select-bordered"
                value={form.size}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
              >
                <option value="">Select Size</option>
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Color</span>
              </label>
              <input
                type="text"
                placeholder="Color"
                className="input input-bordered"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div className="form-control col-span-full">
              <label className="label">
                <span className="label-text font-semibold">Product Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
              />
              {preview && (
                <div className="mt-3">
                  <p className="text-sm font-semibold mb-2">Image Preview:</p>
                  <img
                    src={preview}
                    alt="Product preview"
                    className="w-32 h-32 rounded-lg border-2 border-primary object-cover"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="form-control col-span-full">
              <label className="label">
                <span className="label-text font-semibold">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Product description..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" className="btn btn-primary flex-1">
              {editing ? "Update Product" : "Add Product"}
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

      {/* Products List Tab */}
      {activeTab === "list" && (
        <>
          <div className="overflow-x-auto bg-base-100 rounded-lg shadow-sm">
            <table className="table table-zebra w-full">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Product ID</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Gender</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(limit.lower, limit.upper).map((product) => (
                  <tr key={product.id}>
                    <td className="font-mono text-sm">{product.productId}</td>
                    <td>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.product_name}
                          className="w-12 h-12 rounded object-cover cursor-pointer"
                          onClick={() => handlePreview(product)}
                        />
                      ) : (
                        <div
                          className="w-12 h-12 bg-gray-200 flex items-center justify-center text-xs text-gray-500 cursor-pointer"
                          onClick={() => handlePreview(product)}
                        >
                          No Image
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <div className="font-semibold">
                          {product.product_name}
                        </div>
                        {product.color && (
                          <div className="text-xs text-gray-500">
                            Color: {product.color}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{product.product_company}</td>
                    <td className="font-semibold text-success">
                      {formatPrice(product.cost)}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          product.quantity > 10
                            ? "badge-success"
                            : product.quantity > 0
                            ? "badge-warning"
                            : "badge-error"
                        }`}
                      >
                        {product.quantity || 0} in stock
                      </span>
                    </td>
                    <td>
                      {product.gender ? (
                        <span className="badge badge-outline">
                          {GENDER_OPTIONS.find(
                            (g) => g.value === product.gender
                          )?.label || product.gender}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td>
                      {product.size ? (
                        <span className="badge badge-ghost">
                          {product.size}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-xs btn-info text-white"
                        onClick={() => handlePreview(product)}
                        title="Quick View"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-xs btn-accent text-white"
                        onClick={() => handleEdit(product.id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-xs btn-error text-white"
                        onClick={() => handleDelete(product.id)}
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-gray-400 py-6">
                      No products found. Add your first product!
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
              disabled={limit.upper >= products.length}
              onClick={() => {
                if (limit.upper >= products.length) {
                  toast.info("No more products");
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

      {/* Product Preview Modal */}
      {showPreview && previewProduct && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Product Details</h3>
              <button
                className="btn btn-sm btn-circle"
                onClick={() => setShowPreview(false)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="flex justify-center">
                {previewProduct.image ? (
                  <img
                    src={previewProduct.image}
                    alt={previewProduct.product_name}
                    className="w-64 h-64 rounded-lg object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-primary">
                    {previewProduct.product_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    ID: {previewProduct.productId}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Company:</span>
                    <p>{previewProduct.product_company}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Price:</span>
                    <p className="text-success font-bold">
                      {formatPrice(previewProduct.cost)}
                    </p>
                  </div>
                  <div>
                    <span className="font-semibold">Stock:</span>
                    <p>{previewProduct.quantity || 0} units</p>
                  </div>
                  <div>
                    <span className="font-semibold">Gender:</span>
                    <p>
                      {GENDER_OPTIONS.find(
                        (g) => g.value === previewProduct.gender
                      )?.label || "Not specified"}
                    </p>
                  </div>
                  {previewProduct.size && (
                    <div>
                      <span className="font-semibold">Size:</span>
                      <p>{previewProduct.size}</p>
                    </div>
                  )}
                  {previewProduct.color && (
                    <div>
                      <span className="font-semibold">Color:</span>
                      <p>{previewProduct.color}</p>
                    </div>
                  )}
                </div>

                {previewProduct.description && (
                  <div>
                    <span className="font-semibold">Description:</span>
                    <p className="mt-1 text-sm">{previewProduct.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowPreview(false);
                  handleEdit(previewProduct.id);
                }}
              >
                Edit Product
              </button>
              <button className="btn" onClick={() => setShowPreview(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
