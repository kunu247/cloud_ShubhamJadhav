// File name: ProductsContainer
// File name with extension: ProductsContainer.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\product\ProductsContainer.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\product

import { useEffect, useState } from "react";
import ProductsGrid from "./ProductsGrid";
import { motion } from "framer-motion";
import { PackageOpen, Filter, Grid3X3, List } from "lucide-react";
import { toast } from "react-toastify";

const STORAGE_KEY = "admin_products";

const ProductsContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);

  const loadProducts = () => {
    try {
      setLoading(true);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setProducts(stored);
      setFilteredProducts(stored);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.product_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.product_company
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.productId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply company filter
    if (selectedCompany) {
      filtered = filtered.filter(
        (product) => product.product_company === selectedCompany
      );
    }

    // Apply gender filter
    if (selectedGender) {
      filtered = filtered.filter(
        (product) => product.gender === selectedGender
      );
    }

    // Apply size filter
    if (selectedSize) {
      filtered = filtered.filter((product) => product.size === selectedSize);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.product_name || "").localeCompare(b.product_name || "");
        case "price-low":
          return (a.cost || 0) - (b.cost || 0);
        case "price-high":
          return (b.cost || 0) - (a.cost || 0);
        case "company":
          return (a.product_company || "").localeCompare(
            b.product_company || ""
          );
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [
    products,
    searchTerm,
    selectedCompany,
    selectedGender,
    selectedSize,
    sortBy
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
    setSelectedGender("");
    setSelectedSize("");
    setSortBy("name");
  };

  const getUniqueValues = (key) => {
    return [
      ...new Set(products.map((product) => product[key]).filter(Boolean))
    ];
  };

  const companies = getUniqueValues("product_company");
  const sizes = getUniqueValues("size");

  const totalProducts = filteredProducts.length;
  const hasActiveFilters =
    searchTerm || selectedCompany || selectedGender || selectedSize;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="mt-8 space-y-6"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <PackageOpen className="text-primary" size={28} />
          <div>
            <h4 className="text-2xl font-bold text-primary">
              Products Catalog ({totalProducts})
            </h4>
            <p className="text-sm text-gray-600">
              Browse our collection of premium footwear
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* View Mode Toggle */}
          <div className="join">
            <button
              className={`join-item btn btn-sm ${
                viewMode === "grid" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className={`join-item btn btn-sm ${
                viewMode === "list" ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && (
              <span className="badge badge-primary badge-sm ml-1">
                {
                  [
                    searchTerm,
                    selectedCompany,
                    selectedGender,
                    selectedSize
                  ].filter(Boolean).length
                }
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-base-200 rounded-xl p-6 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h5 className="font-semibold">Filter Products</h5>
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Search</span>
              </label>
              <input
                type="text"
                placeholder="Search products..."
                className="input input-bordered"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Company Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Company</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Gender</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="U">Unisex</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Size</span>
              </label>
              <select
                className="select select-bordered"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                <option value="">All Sizes</option>
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold">Sort By:</span>
            <select
              className="select select-bordered select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="company">Company</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="badge badge-primary badge-lg gap-2">
              Search: `{searchTerm}`
              <button onClick={() => setSearchTerm("")}>×</button>
            </div>
          )}
          {selectedCompany && (
            <div className="badge badge-secondary badge-lg gap-2">
              Company: {selectedCompany}
              <button onClick={() => setSelectedCompany("")}>×</button>
            </div>
          )}
          {selectedGender && (
            <div className="badge badge-accent badge-lg gap-2">
              Gender:{" "}
              {selectedGender === "M"
                ? "Male"
                : selectedGender === "F"
                ? "Female"
                : "Unisex"}
              <button onClick={() => setSelectedGender("")}>×</button>
            </div>
          )}
          {selectedSize && (
            <div className="badge badge-info badge-lg gap-2">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize("")}>×</button>
            </div>
          )}
        </div>
      )}

      {/* Products Count and Status */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {totalProducts} of {products.length} products
          {hasActiveFilters && " (filtered)"}
        </div>

        {totalProducts === 0 && products.length > 0 && (
          <div className="text-warning text-sm">
            No products match your filters.{" "}
            <button className="link" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Products Grid/List */}
      <ProductsGrid
        products={filteredProducts}
        viewMode={viewMode}
        loading={loading}
      />

      {/* Empty State */}
      {products.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <PackageOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500 mb-6">
            There are no products in the catalog yet.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/admin/products")}
          >
            Add Your First Product
          </button>
        </motion.div>
      )}

      {totalProducts === 0 && products.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <PackageOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Matching Products
          </h3>
          <p className="text-gray-500 mb-6">
            No products match your current filters.
          </p>
          <button className="btn btn-outline" onClick={clearFilters}>
            Clear All Filters
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProductsContainer;
