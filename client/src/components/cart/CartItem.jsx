// File name: CartItem
// File name with extension: CartItem.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\cart\CartItem.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\cart

// CartItem.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatPrice, generateAmountOptions } from "../../utils";
import { useGlobalContext } from "../../context";

const CartItem = React.memo(({ cartItem }) => {
  const { updateCartItem, removeFromCart } = useGlobalContext();
  const {
    product_id,
    product_name,
    cost,
    image,
    cart_quantity,
    product_company,
    color,
    size
  } = cartItem;

  const [amount, setAmount] = useState(cart_quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * 🔁 Update item quantity
   */
  const handleAmountChange = async (e) => {
    const newAmount = Number(e.target.value);
    if (newAmount === amount) return;

    setAmount(newAmount);
    setIsUpdating(true);

    // Simulate API delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    updateCartItem(product_id, newAmount);

    setIsUpdating(false);
  };

  /**
   * 🗑️ Remove item from cart
   */
  const handleRemove = () => {
    removeFromCart(product_id);
  };

  return (
    <article
      className={`mb-6 flex flex-col gap-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0 transition-all duration-300 ${
        isUpdating ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* 🖼️ Product Image */}
      <div className="flex-shrink-0">
        <img
          src={image || "/placeholder-image.jpg"}
          alt={product_name}
          className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover shadow-md hover:shadow-lg transition-shadow"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* 📦 Product Info */}
      <div className="sm:ml-6 sm:flex-1 min-w-0">
        <h3 className="capitalize font-medium text-lg text-gray-900 truncate">
          {product_name}
        </h3>
        <div className="mt-2 space-y-1">
          <p className="capitalize text-sm text-gray-600">
            Brand:{" "}
            <span className="font-medium text-yellow-600">
              {product_company}
            </span>
          </p>
          <p className="capitalize text-sm text-gray-600 flex items-center gap-x-2">
            Color:
            <span
              className="inline-block w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              title={color}
            ></span>
            <span className="text-gray-500">{color}</span>
          </p>
          <p className="capitalize text-sm text-gray-600">
            Size: <span className="font-medium text-gray-900">{size}</span>
          </p>
        </div>
      </div>

      {/* 🧮 Quantity Control */}
      <div className="sm:ml-6 flex flex-col items-start">
        <div className="form-control">
          <label htmlFor={`amount-${product_id}`} className="label py-1">
            <span className="label-text font-medium">Quantity</span>
          </label>
          <select
            name="amount"
            id={`amount-${product_id}`}
            disabled={isUpdating}
            className={`select select-bordered select-sm min-w-20 ${
              isUpdating ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            value={amount}
            onChange={handleAmountChange}
          >
            {generateAmountOptions(10)}
          </select>
        </div>
        <button
          className={`mt-3 text-red-600 hover:text-red-800 text-sm font-medium transition-colors ${
            isUpdating ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleRemove}
          disabled={isUpdating}
        >
          {isUpdating ? "Updating..." : "Remove"}
        </button>
      </div>

      {/* 💰 Price */}
      <div className="sm:ml-auto text-right">
        <p className="text-lg font-bold text-primary">
          {formatPrice(cost * amount)}
        </p>
        <p className="text-sm text-gray-500 mt-1">{formatPrice(cost)} each</p>
      </div>
    </article>
  );
});

CartItem.displayName = "CartItem";

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
    image: PropTypes.string,
    cart_quantity: PropTypes.number.isRequired,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    product_company: PropTypes.string,
    color: PropTypes.string
  }).isRequired
};

export default CartItem;
