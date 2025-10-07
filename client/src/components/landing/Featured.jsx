// File name: Featured
// File name with extension: Featured.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\landing\Featured.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\landing

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { customFetch, formatPrice } from "../../utils";
import SectionTitle from "../cart/SectionTitle";

const Featured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await customFetch(`/products`);
        // ✅ Access the real array
        const productList = response?.data?.data || [];
        setProducts(productList.slice(0, 3));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load featured products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <p className="text-center py-10">Loading featured products...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

  return (
    <>
      <SectionTitle text="Featured Products" />
      <div className="grid pt-12 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const { cost, product_name, image, product_id } = product;
          return (
            <Link
              key={product_id}
              to={`/products/${product_id}`}
              className="w-full card shadow-xl hover:shadow-2xl transition duration-300"
            >
              <figure className="px-4 pt-4">
                <img
                  src={image}
                  alt={product_name}
                  className="rounded-xl h-64 md:h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title capitalize tracking-wider">
                  {product_name}
                </h2>
                <span className="text-secondary">{formatPrice(cost)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Featured;
