// File name: SingleProduct
// File name with extension: SingleProduct.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\SingleProduct.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../utils";
import { ShoppingCart, ArrowLeftCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context";

export const loader = async ({ params }) => {
  const res = await fetch(`/api/v1/products/${params.id}`);
  const data = await res.json();
  return data?.data?.[0] || {};
};

const SingleProduct = () => {
  const product = useLoaderData();
  const { customer, fetchCart } = useGlobalContext();

  const addToCart = async () => {
    if (!customer) {
      toast.info("Please log in to add items to your cart.");
      return;
    }
    try {
      const payload = {
        cart_quantity: 1,
        cart_id: customer.cart_id,
        product_id: product.product_id,
        purchased: "NO"
      };
      await fetch("/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      toast.success(`${product.product_name} added to cart!`);
      fetchCart(false);
    } catch (err) {
      toast.error("Failed to add product to cart.");
    }
  };

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

        <div>
          <h2 className="text-3xl font-semibold mb-3 capitalize">
            {product.product_name}
          </h2>
          <p className="text-neutral-content mb-2">{product.product_company}</p>
          <h3 className="text-2xl font-bold text-secondary mb-4">
            {formatPrice(product.cost)}
          </h3>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addToCart}
            className="btn btn-primary flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SingleProduct;
