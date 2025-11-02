// File name: ProductsGrid
// File name with extension: ProductsGrid.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\product\ProductsGrid.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\product

import { Link } from "react-router-dom";
import { formatPrice } from "../../utils";
import { motion } from "framer-motion";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import { useState } from "react";
import PropTypes from "prop-types";

// LocalStorage keys
const STORAGE_KEYS = {
  CART: "user_cart",
  CUSTOMER: "current_customer"
};

const ProductsGrid = ({
  products = [],
  viewMode = "grid",
  loading = false
}) => {
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, val) =>
    setQuantities((prev) => ({ ...prev, [id]: val }));

  // Get current customer from localStorage
  const getCurrentCustomer = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || "null");
    } catch {
      return null;
    }
  };

  // Get or create cart for customer
  const getOrCreateCart = () => {
    const customer = getCurrentCustomer();
    if (!customer) return null;

    try {
      const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
      let userCart = carts.find((cart) => cart.customer_id === customer.id);

      if (!userCart) {
        userCart = {
          cart_id: Date.now(),
          customer_id: customer.id,
          items: [],
          created_at: new Date().toISOString()
        };
        carts.push(userCart);
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(carts));
      }

      return userCart;
    } catch (error) {
      console.error("Error accessing cart:", error);
      return null;
    }
  };

  // Update cart in localStorage
  const updateCart = (cart) => {
    try {
      const carts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || "[]");
      const updatedCarts = carts.map((c) =>
        c.cart_id === cart.cart_id ? cart : c
      );
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updatedCarts));
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const addToCart = (product) => {
    const customer = getCurrentCustomer();
    if (!customer) {
      toast.info("Please log in to add items to your cart.");
      return;
    }

    if ((product.quantity || 0) <= 0) {
      toast.warn("This product is currently out of stock.");
      return;
    }

    try {
      const cart = getOrCreateCart();
      if (!cart) {
        toast.error("Failed to access your cart.");
        return;
      }

      const qty = Number(quantities[product.id] || 1);

      // Check if product already exists in cart
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product_id === product.id
      );

      let updatedCart;
      if (existingItemIndex > -1) {
        // Update existing item quantity
        updatedCart = {
          ...cart,
          items: cart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, cart_quantity: item.cart_quantity + qty }
              : item
          )
        };
      } else {
        // Add new item to cart
        const newItem = {
          cart_item_id: Date.now(),
          product_id: product.id,
          product_name: product.product_name,
          product_company: product.product_company,
          cost: product.cost,
          image: product.image,
          cart_quantity: qty,
          purchased: "NO",
          added_at: new Date().toISOString()
        };
        updatedCart = {
          ...cart,
          items: [...cart.items, newItem]
        };
      }

      updateCart(updatedCart);
      toast.success(`${product.product_name} added (${qty}) 🛒`);

      // Reset quantity input for this product after adding
      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton h-80 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4 pt-6">
        {products.map((product, i) => {
          const isOutOfStock = (product.quantity || 0) <= 0;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex gap-4 p-4 bg-base-100 rounded-xl shadow-sm border ${
                isOutOfStock ? "opacity-70 grayscale" : "hover:shadow-md"
              }`}
            >
              <Link to={`/products/${product.id}`} className="flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
              </Link>

              <div className="flex-1">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                    {product.product_name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600">
                  {product.product_company}
                </p>
                <p className="text-secondary font-medium text-lg mt-1">
                  {formatPrice(product.cost)}
                </p>

                {!isOutOfStock && (
                  <div className="flex items-center gap-3 mt-2">
                    <input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantities[product.id] || 1}
                      onChange={(e) =>
                        handleQtyChange(product.id, e.target.value)
                      }
                      className="input input-bordered input-sm w-20"
                    />
                    <button
                      onClick={() => addToCart(product)}
                      className="btn btn-primary btn-sm flex items-center gap-2"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>

              {isOutOfStock && (
                <div className="flex items-center text-error text-sm">
                  <AlertTriangle className="mr-1" size={16} />
                  Out of Stock
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Grid View (default)
  return (
    <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => {
        const isOutOfStock = (product.quantity || 0) <= 0;

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: !isOutOfStock ? 1.04 : 1 }}
            className={`relative group rounded-2xl bg-base-100 shadow-lg border border-base-200 overflow-hidden ${
              isOutOfStock ? "opacity-70 grayscale" : "hover:shadow-xl"
            }`}
          >
            {/* Out of stock overlay */}
            {isOutOfStock && (
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertTriangle className="mr-2" size={20} /> Out of Stock
              </motion.div>
            )}

            <Link to={`/products/${product.id}`}>
              <motion.img
                src={product.image}
                alt={product.product_name}
                className="rounded-t-2xl h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="p-5 flex flex-col text-center">
              <Link to={`/products/${product.id}`}>
                <h2 className="text-lg font-semibold capitalize truncate hover:text-primary transition-colors">
                  {product.product_name}
                </h2>
              </Link>
              <span className="text-sm text-neutral-content mt-1 mb-2">
                {product.product_company}
              </span>
              <span className="text-secondary font-medium text-lg mb-3">
                {formatPrice(product.cost)}
              </span>

              {!isOutOfStock && (
                <>
                  <input
                    type="number"
                    min="1"
                    max={product.quantity}
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      handleQtyChange(product.id, e.target.value)
                    }
                    className="input input-bordered input-sm text-center w-20 mx-auto mb-3"
                  />

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(product)}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 hover:gap-3 transition-all"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// PropTypes validation
ProductsGrid.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      product_name: PropTypes.string.isRequired,
      product_company: PropTypes.string.isRequired,
      cost: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      image: PropTypes.string,
      quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      productId: PropTypes.string,
      gender: PropTypes.string,
      size: PropTypes.string,
      color: PropTypes.string,
      description: PropTypes.string
    })
  ),
  viewMode: PropTypes.oneOf(["grid", "list"]),
  loading: PropTypes.bool
};

// Default props
ProductsGrid.defaultProps = {
  products: [],
  viewMode: "grid",
  loading: false
};

export default ProductsGrid;
