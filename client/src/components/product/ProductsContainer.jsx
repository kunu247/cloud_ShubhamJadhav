// File name: ProductsContainer
// File name with extension: ProductsContainer.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\product\ProductsContainer.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\product

import ProductsGrid from "./ProductsGrid";
import { useLoaderData } from "react-router-dom";
import { motion } from "framer-motion";
import { PackageOpen } from "lucide-react";

const ProductsContainer = () => {
  const { products } = useLoaderData();
  const totalProducts = products.length;

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center border-b border-base-300 pb-5 mb-4">
        <div className="flex items-center gap-3">
          <PackageOpen className="text-primary" size={24} />
          <h4 className="font-medium text-lg">
            {totalProducts} Product{totalProducts !== 1 && "s"} found
          </h4>
        </div>
      </div>
      <ProductsGrid />
    </motion.div>
  );
};

export default ProductsContainer;
