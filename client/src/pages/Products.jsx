// File name: Products
// File name with extension: Products.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Products.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { ProductsContainer } from "../components";
import { customFetch } from "../utils";

export const loader = async () => {
  const response = await customFetch("/products");
  const products = (await response?.data?.data) || [];

  return { products };
};

const Products = () => {
  return (
    <div className="align-element pt-20">
      <ProductsContainer />
    </div>
  );
};

export default Products;
