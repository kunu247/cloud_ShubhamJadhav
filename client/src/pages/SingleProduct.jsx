// File name: SingleProduct
// File name with extension: SingleProduct.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\SingleProduct.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { customFetch, formatPrice, generateAmountOptions } from "../utils";
import { useGlobalContext } from "../context";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { customer, fetchCart } = useGlobalContext();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  const [amount, setAmount] = useState(1);
  const handleAmount = (e) => setAmount(e.target.value);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await customFetch(`/products/${id}`);
        const data = response?.data?.data;

        if (Array.isArray(data) && data.length > 0) {
          setProduct(data[0]);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h1 className="text-center py-10">Loading...</h1>;
  if (error) return <h1 className="text-center text-red-500 py-10">{error}</h1>;

  const {
    product_name,
    cost,
    image,
    product_company,
    color,
    size,
    gender,
    quantity
  } = product;

  const addToCart = async () => {
    if (!customer || !customer.cart_id) {
      toast.warn("Please log in to add items to your cart.");
      return;
    }

    const intAmount = parseInt(amount);
    const payload = {
      cart_quantity: intAmount,
      cart_id: customer.cart_id,
      product_id: id,
      purchased: "no"
    };

    try {
      await customFetch.post("/cart", payload);
      fetchCart();
      toast.success("Added To Cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.warn("Item Already In Cart");
    }
  };

  return (
    <section className="align-element pt-20">
      <div className="text-md breadcrumbs">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </div>

      {/* PRODUCTS */}
      <div className="mt-6 grid gap-y-8 lg:grid-cols-2 lg:gap-x-16">
        <img
          src={image}
          alt={product_name}
          className="w-96 h-96 object-cover rounded-lg lg:w-full"
        />
        <div>
          <h1 className="capitalize text-3xl font-bold">{product_name}</h1>
          <h4 className="text-xl text-neutral-content font-bold mt-2">
            {product_company}
          </h4>

          {/* COLORS */}
          <div className="mt-6 flex gap-x-4">
            <h4 className="text-md font-medium tracking-wider capitalize">
              color :
            </h4>
            <div className="flex gap-x-2 capitalize">
              <p>{color}</p>
              <button
                type="button"
                className={`badge w-6 h-6 mr-2 ${
                  color && "border-2 border-secondary"
                }`}
                style={{ backgroundColor: color }}
              ></button>
            </div>
          </div>

          {/* GENDER */}
          <div className="mt-3 flex gap-x-4">
            <h4 className="text-md font-medium tracking-wider capitalize">
              gender :
            </h4>
            <div className="flex gap-x-2 capitalize">
              <p>
                {gender === "M" ? "Male" : gender === "F" ? "Female" : "Unisex"}
              </p>
            </div>
          </div>

          {/* SIZE */}
          <div className="mt-3 flex gap-x-4">
            <h4 className="text-md font-medium tracking-wider capitalize">
              size :
            </h4>
            <div className="flex gap-x-2 capitalize">
              <p>{size}</p>
            </div>
          </div>

          {/* AMOUNT */}
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <h4 className="text-md font-medium tracking-wider capitalize">
                amount : {formatPrice(cost)}
              </h4>
            </label>
            <select
              className="select select-bordered select-md select-secondary"
              value={amount}
              onChange={handleAmount}
            >
              {generateAmountOptions(10)}
            </select>
          </div>

          {/* CART BUTTON */}
          <div className="mt-10">
            <button
              className="btn btn-secondary btn-md uppercase"
              onClick={addToCart}
              disabled={quantity === 0 || !customer}
            >
              {!customer
                ? "Login to Add"
                : quantity === 0
                ? "Sold Out"
                : "Add To Bag"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
