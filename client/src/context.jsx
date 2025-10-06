// File name: context
// File name with extension: context.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\context.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src

import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { customFetch } from "./utils";
import { toast } from "react-toastify";

const AppContext = React.createContext();

/* ✅ Centralized safe executor for async calls */
const safeExec = async (
  label,
  fn,
  { showToast = true, fallback = null } = {}
) => {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    logError(label, error);
    const status = error?.response?.status;
    const message =
      error?.response?.data?.msg ||
      error?.message ||
      "Unexpected error occurred.";

    if (showToast) {
      if (status === 404) toast.info(`${label}: Not found`);
      else if (error?.request)
        toast.error(`${label}: Network issue. Please try again.`);
      else toast.error(`${label}: ${message}`);
    }

    return fallback;
  }
};

/* ✅ Safe, reusable error logger */
const logError = (context, error) => {
  if (!error) return console.warn(`[${context}] Empty error object received.`);

  const status = error?.response?.status || "no-status";
  const msg =
    error?.response?.data?.msg || error?.message || "Unknown error occurred.";
  console.groupCollapsed(`🧭 [${context}] (${status})`);
  console.error("Message:", msg);
  console.error("Details:", error?.response?.data || error);
  console.groupEnd();
};

const AppProvider = ({ children }) => {
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

  /* ✅ Safe customer loading with guard */
  useEffect(() => {
    try {
      const local = localStorage.getItem("customer");
      if (!local) {
        setCustomer(null);
        setLoading(false);
        return;
      }

      const custLocal = JSON.parse(local);
      if (custLocal && typeof custLocal === "object") {
        setCustomer(custLocal);
      } else {
        console.warn("Invalid customer object in localStorage.");
        localStorage.removeItem("customer");
        setCustomer(null);
      }
    } catch (err) {
      logError("LocalStorage Parse", err);
      localStorage.removeItem("customer");
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ✅ Fetch Cart with defensive logic */
  const fetchCart = async (showToast = true) => {
    if (!customer?.cart_id) {
      if (showToast) toast.info("Please log in to view your cart.");
      setCart([]);
      return;
    }

    const result = await safeExec(
      "Cart Fetch",
      async () => {
        const res = await customFetch.get(`cart/${customer.cart_id}`);
        const data = res?.data;
        if (!data?.success || !Array.isArray(data.data)) {
          if (showToast) toast.warn(data?.msg || "Unable to load cart");
          setCart([]);
          return [];
        }

        if (data.data.length === 0) {
          if (showToast) toast.info(data?.msg || "Your cart is empty.");
          setCart([]);
          return [];
        }
        setCart(data.data);
        return data.data;
      },
      { showToast, fallback: [] }
    );

    return result;
  };

  /* ✅ Auto-fetch when customer changes */
  useEffect(() => {
    if (customer?.cart_id) fetchCart(false);
    else setCart([]);
  }, [customer]);

  /* ✅ Calculate Total with guards */
  const calculateTotal = async (showToast = true) => {
    if (!customer?.cart_id) {
      if (showToast) toast.info("Please log in to view totals.");
      setPrice({ base: 0, shipping: 0, tax: 0, total: 0 });
      return;
    }

    await safeExec(
      "Total Calculation",
      async () => {
        const res = await customFetch.get(`cart/${customer.cart_id}`);
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
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        customer,
        setCustomer,
        cart,
        fetchCart,
        price,
        changeAmount,
        setChangeAmount,
        calculateTotal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* ✅ PropTypes validation */
AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useGlobalContext = () => useContext(AppContext);
export { AppContext, AppProvider };
