// File name: ProductsGrid
// File name with extension: ProductsGrid.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\product\ProductsGrid.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\product

import { Link, useLoaderData } from "react-router-dom";
import { formatPrice } from "../../utils";
// import { formatPrice } from '../utils'

const ProductsGrid = () => {
  const { products } = useLoaderData();
  return (
    <div className="grid pt-12 gap-4  md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => {
        const { cost, product_name, image } = product;
        // const dollarAmount = formatPrice(cost);
        return (
          <Link
            key={product.product_id}
            to={`/products/${product.product_id}`}
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
  );
};

export default ProductsGrid;
