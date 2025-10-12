// File name: ProductsGrid
// File name with extension: ProductsGrid.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\product\ProductsGrid.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\product

import { Link, useLoaderData } from "react-router-dom";
import { formatPrice } from "../../utils";
import { motion } from "framer-motion";
import { ShoppingCart, AlertTriangle } from "lucide-react";
import { useGlobalContext } from "../../context";
import { toast } from "react-toastify";
import { useState } from "react";

const ProductsGrid = () => {
  const { products } = useLoaderData();
  const { customer, fetchCart } = useGlobalContext();
  const [quantities, setQuantities] = useState({});

  const handleQtyChange = (id, val) =>
    setQuantities((prev) => ({ ...prev, [id]: val }));

  const addToCart = async (product) => {
    if (!customer) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    if (product.quantity <= 0) {
      toast.warn("This product is currently out of stock.");
      return;
    }

    try {
      const qty = Number(quantities[product.product_id] || 1);
      const payload = {
        cart_quantity: qty,
        cart_id: customer.cart_id,
        product_id: product.product_id,
        purchased: "NO"
      };

      await fetch("/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      toast.success(`${product.product_name} added (${qty}) 🛒`);
      fetchCart(false);

      // ✅ Reset quantity input for this product after adding
      setQuantities((prev) => ({ ...prev, [product.product_id]: 1 }));
    } catch {
      toast.error("Failed to add product to cart.");
    }
  };

  return (
    <div className="grid gap-6 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => {
        const {
          product_name,
          cost,
          image,
          product_id,
          product_company,
          quantity
        } = product;

        const isOutOfStock = quantity <= 0;

        return (
          <motion.div
            key={product_id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: !isOutOfStock ? 1.04 : 1 }}
            className={`relative group rounded-2xl bg-base-100 shadow-lg border border-base-200 overflow-hidden ${
              isOutOfStock ? "opacity-70 grayscale" : "hover:shadow-xl"
            }`}
          >
            {/* Out of stock animation */}
            {isOutOfStock && (
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertTriangle className="mr-2" /> Out of Stock
              </motion.div>
            )}

            <Link to={`/products/${product_id}`}>
              <motion.img
                src={image}
                alt={product_name}
                className="rounded-t-2xl h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="p-5 flex flex-col text-center">
              <h2 className="text-lg font-semibold capitalize truncate">
                {product_name}
              </h2>
              <span className="text-sm text-neutral-content mt-1 mb-2">
                {product_company}
              </span>
              <span className="text-secondary font-medium text-lg mb-3">
                {formatPrice(cost)}
              </span>

              {!isOutOfStock && (
                <>
                  <input
                    type="number"
                    min="1"
                    max={quantity}
                    value={quantities[product_id] || 1}
                    onChange={(e) =>
                      handleQtyChange(product_id, e.target.value)
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

export default ProductsGrid;
