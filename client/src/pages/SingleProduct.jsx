// File name: SingleProduct
// File name with extension: SingleProduct.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\SingleProduct.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../utils";
import { ShoppingCart, ArrowLeftCircle, Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";

const STORAGE_KEYS = {
  PRODUCTS: "admin_products",
  CART: "user_cart",
  CUSTOMER: "current_customer"
};

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = () => {
    try {
      setLoading(true);
      const products = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.PRODUCTS) || "[]"
      );
      const foundProduct = products.find((p) => p.id === parseInt(id));
      setProduct(foundProduct || null);
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

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

  const addToCart = () => {
    if (!product) return;

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
              ? { ...item, cart_quantity: item.cart_quantity + quantity }
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
          cart_quantity: quantity,
          purchased: "NO",
          added_at: new Date().toISOString()
        };
        updatedCart = {
          ...cart,
          items: [...cart.items, newItem]
        };
      }

      updateCart(updatedCart);
      toast.success(`${product.product_name} added to cart (${quantity})! 🛒`);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < (product.quantity || 0)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="align-element pt-20 text-center">
        <h1 className="text-2xl font-bold text-error mb-4">
          Product Not Found
        </h1>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeftCircle size={20} className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = (product.quantity || 0) <= 0;

  return (
    <motion.div
      className="align-element pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Link
        to="/products"
        className="flex items-center gap-2 mb-6 text-primary hover:underline"
      >
        <ArrowLeftCircle size={20} /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <motion.img
          src={product.image}
          alt={product.product_name}
          className="rounded-2xl w-full h-96 object-cover shadow-md"
          whileHover={{ scale: 1.02 }}
        />

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold mb-3 capitalize">
              {product.product_name}
            </h2>
            <p className="text-neutral-content text-lg mb-2">
              {product.product_company}
            </p>
            <h3 className="text-2xl font-bold text-secondary mb-4">
              {formatPrice(product.cost)}
            </h3>
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            {product.gender && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Gender:</span>
                <span className="badge badge-outline">
                  {product.gender === "M"
                    ? "Male"
                    : product.gender === "F"
                    ? "Female"
                    : "Unisex"}
                </span>
              </div>
            )}

            {product.size && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Size:</span>
                <span className="badge badge-ghost">{product.size}</span>
              </div>
            )}

            {product.color && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Color:</span>
                <span>{product.color}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="font-semibold">Stock:</span>
              <span
                className={`badge ${
                  isOutOfStock ? "badge-error" : "badge-success"
                }`}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : `${product.quantity} available`}
              </span>
            </div>
          </div>

          {product.description && (
            <div>
              <h4 className="font-semibold mb-2">Description:</h4>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Quantity Selector and Add to Cart */}
          {!isOutOfStock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="join">
                  <button
                    className="join-item btn btn-sm"
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <div className="join-item btn btn-sm no-animation">
                    {quantity}
                  </div>
                  <button
                    className="join-item btn btn-sm"
                    onClick={increaseQuantity}
                    disabled={quantity >= (product.quantity || 0)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={addToCart}
                className="btn btn-primary flex items-center gap-2 w-full md:w-auto"
              >
                <ShoppingCart size={18} />
                Add to Cart ({quantity})
              </motion.button>
            </div>
          )}

          {isOutOfStock && (
            <div className="alert alert-warning">
              <span>
                This product is currently out of stock. Please check back later.
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SingleProduct;
