// File name: context
// File name with extension: context.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\context.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src

import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { customFetch } from "./utils";
import { toast } from "react-toastify";

const AppContext = React.createContext();

/* 🧩 Safe Executor — handles API calls with unified error management */
const safeExec = async (
  label,
  fn,
  { showToast = true, fallback = null } = {}
) => {
  try {
    return await fn();
  } catch (error) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.msg ||
      error?.message ||
      "Unexpected error occurred.";

    console.groupCollapsed(`🚨 [${label}]`);
    console.error(message, error);
    console.groupEnd();

    if (showToast) {
      if (status === 404) toast.info(`${label}: Not found`);
      else if (error?.request)
        toast.error(`${label}: Network issue. Please try again.`);
      else toast.error(`${label}: ${message}`);
    }

    return fallback;
  }
};

const AppProvider = ({ children }) => {
  /* 🌍 Global States */
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [changeAmount, setChangeAmount] = useState(0);
  const [price, setPrice] = useState({
    base: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  /* 🧠 Load Customer from LocalStorage */
  useEffect(() => {
    try {
      const local = localStorage.getItem("customer");
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed && typeof parsed === "object") setCustomer(parsed);
        else localStorage.removeItem("customer");
      }
    } catch (err) {
      console.error("LocalStorage Parse Error:", err);
      localStorage.removeItem("customer");
    } finally {
      setLoading(false);
    }
  }, []);

  /* 🛒 Fetch Cart Items (Enriched from Backend) */
  const fetchCart = useCallback(
    async (showToast = true) => {
      if (!customer?.cart_id) {
        if (showToast) toast.info("Please log in to view your cart.");
        setCart([]);
        return [];
      }

      return await safeExec(
        "Cart Fetch",
        async () => {
          const res = await customFetch.get(`/cart`, {
            params: { id: customer.cart_id }
          });

          const rawData = res?.data?.data || [];
          console.groupCollapsed("🧾 Cart API Response");
          console.table(rawData);
          console.groupEnd();

          if (!Array.isArray(rawData) || rawData.length === 0) {
            if (showToast) toast.info("Your cart is empty.");
            setCart([]);
            return [];
          }

          /* 🧩 Normalize and enrich items */
          const normalized = rawData.map((item) => ({
            product_name: item.product_name ?? "Unknown Product",
            product_company: item.product_company ?? "Unknown Brand",
            product_id: item.product_id ?? "N/A",
            cart_quantity: Number(item.cart_quantity) || 0,
            cost: Number(item.cost) || 0,
            color: item.color || "N/A",
            size: item.size || "N/A",
            image:
              item.image?.startsWith("http") ||
              item.image?.startsWith("data:image")
                ? item.image
                : `${
                    import.meta.env.VITE_API_URL || "http://localhost:8065"
                  }/uploads/${item.image || "placeholder.jpg"}`,
            cart_id: item.cart_id ?? customer.cart_id,
            date_added: item.date_added || null,
            purchased: item.purchased ?? "no",
            isactive: item.isactive ?? true
          }));

          setCart(normalized);
          return normalized;
        },
        { showToast, fallback: [] }
      );
    },
    [customer]
  );

  /* 🔁 Auto-fetch cart when customer logs in/changes */
  useEffect(() => {
    if (customer?.cart_id) fetchCart(false);
    else setCart([]);
  }, [customer, fetchCart]);

  /* 💰 Calculate Total Summary */
  const calculateTotal = useCallback(
    async (showToast = true) => {
      if (!customer?.cart_id) {
        if (showToast) toast.info("Please log in to view totals.");
        setPrice({ base: 0, shipping: 0, tax: 0, total: 0 });
        return;
      }

      await safeExec(
        "Total Calculation",
        async () => {
          const res = await customFetch.get(`/cart`, {
            params: { id: customer.cart_id }
          });

          const data = res?.data?.data || [];
          if (!Array.isArray(data) || data.length === 0) {
            if (showToast) toast.warn("Your cart is empty.");
            setPrice({ base: 0, shipping: 0, tax: 0, total: 0 });
            return;
          }

          const baseValue = data.reduce((sum, item) => {
            const qty = Number(item?.cart_quantity) || 0;
            const cost = Number(item?.cost) || 0;
            return sum + qty * cost;
          }, 0);

          const shipping = 500;
          const tax = ((baseValue / 100 + shipping) * 5) / 100;
          const totalAmount = baseValue / 100 + shipping + tax;

          setPrice({
            base: baseValue / 100,
            shipping,
            tax,
            total: totalAmount
          });
        },
        { showToast }
      );
    },
    [customer]
  );

  /* 🧩 Provider Value */
  const contextValue = {
    loading,
    customer,
    setCustomer,
    cart,
    fetchCart,
    price,
    changeAmount,
    setChangeAmount,
    calculateTotal
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

/* ✅ PropTypes validation */
AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useGlobalContext = () => useContext(AppContext);
export { AppContext, AppProvider };
