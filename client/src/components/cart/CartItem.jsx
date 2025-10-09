// File name: CartItem
// File name with extension: CartItem.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\cart\CartItem.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\cart

// File: CartItem.jsx
// Path: E:\cloud_ShubhamJadhav\client\src\components\cart

import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { customFetch, formatPrice, generateAmountOptions } from "../../utils";
import { useGlobalContext } from "../../context";
import { toast } from "react-toastify";

/**
 * ✅ Safe wrapper for API operations with centralized error handling
 */
const safeExec = async (label, fn, { onError } = {}) => {
  try {
    return await fn();
  } catch (error) {
    console.groupCollapsed(`❌ [${label}]`);
    console.error(error);
    console.groupEnd();

    const msg =
      error?.response?.data?.msg ||
      error?.message ||
      "Unexpected error occurred.";
    toast.error(`${label}: ${msg}`);
    if (onError) onError(error);
    return null;
  }
};

/**
 * 💼 CartItem Component
 * Renders a single product item in the user's shopping cart.
 */
const CartItem = React.memo(({ cartItem }) => {
  const { fetchCart, changeAmount, setChangeAmount } = useGlobalContext();
  const {
    product_id,
    product_name,
    cost,
    image,
    cart_quantity,
    product_company,
    color,
    cart_id
  } = cartItem;

  const [amount, setAmount] = useState(cart_quantity);

  /**
   * 🧹 Remove an item from the cart
   */
  const removeItemFromCart = useCallback(async () => {
    await safeExec("Cart Delete", async () => {
      await customFetch.patch(`/cart/delete/${cart_id}`, {
        product_id
      });
      toast.success(`${product_name} removed from cart`);
      await fetchCart();
    });
  }, [cart_id, product_id, product_name, fetchCart]);

  /**
   * 🔁 Update item quantity in cart
   */
  const updateQuantity = useCallback(
    async (newAmount) => {
      await safeExec("Cart Update", async () => {
        await customFetch.patch(`/cart/${cart_id}`, {
          cart_quantity: newAmount,
          product_id
        });
      });
    },
    [cart_id, product_id]
  );

  /**
   * 🧮 Handle dropdown amount change
   */
  const handleAmountChange = async (e) => {
    const newAmount = Number(e.target.value);
    if (newAmount === amount) return;

    setAmount(newAmount);
    setChangeAmount(changeAmount + 1);
    await updateQuantity(newAmount);
    await fetchCart();
  };

  return (
    <article className="mb-12 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0">
      {/* 🖼️ Product Image */}
      <img
        src={image}
        alt={product_name}
        className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
        loading="lazy"
      />

      {/* 📦 Product Info */}
      <div className="sm:ml-16 sm:w-48">
        <h3 className="capitalize font-medium">{product_name}</h3>
        <h4 className="mt-2 capitalize text-sm text-neutral-content">
          {product_company}
        </h4>
        <p className="mt-4 capitalize text-sm flex items-center gap-x-2">
          Color:
          <span
            className="badge badge-sm"
            style={{ backgroundColor: color }}
            title={color}
          ></span>
        </p>
      </div>

      {/* 🧮 Quantity Control */}
      <div className="sm:ml-12">
        <div className="form-control max-w-xs">
          <label htmlFor={`amount-${product_id}`} className="label p-0">
            <span className="label-text">Amount</span>
          </label>
          <select
            name="amount"
            id={`amount-${product_id}`}
            className="mt-2 select select-base select-bordered select-xs"
            value={amount}
            onChange={handleAmountChange}
          >
            {generateAmountOptions(10)}
          </select>
        </div>
        <button
          className="mt-2 link link-primary link-hover text-sm"
          onClick={removeItemFromCart}
        >
          Remove
        </button>
      </div>

      {/* 💰 Price */}
      <p className="font-medium sm:ml-auto text-primary">{formatPrice(cost)}</p>
    </article>
  );
});

// Set display name for the component
CartItem.displayName = "CartItem";

export default CartItem;

/* ✅ PropTypes validation */
CartItem.propTypes = {
  cartItem: PropTypes.shape({
    product_id: PropTypes.string.isRequired,
    product_name: PropTypes.string.isRequired,
    cost: PropTypes.number.isRequired,
    image: PropTypes.string,
    cart_quantity: PropTypes.number.isRequired,
    product_company: PropTypes.string,
    color: PropTypes.string,
    cart_id: PropTypes.string.isRequired
  }).isRequired
};
