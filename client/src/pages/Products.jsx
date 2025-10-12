// File name: Products
// File name with extension: Products.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Products.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { ProductsContainer } from "../components";
import { customFetch } from "../utils";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";

export const loader = async () => {
  const response = await customFetch("/products");
  const products = response?.data?.data || [];
  return { products };
};

const Products = () => {
  return (
    <motion.div
      className="align-element pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-6">
        <ShoppingBag size={32} className="text-primary mr-3" />
        <h1 className="text-4xl font-semibold text-base-content tracking-wide">
          Explore Our Collection
        </h1>
      </div>
      <ProductsContainer />
    </motion.div>
  );
};

export default Products;
