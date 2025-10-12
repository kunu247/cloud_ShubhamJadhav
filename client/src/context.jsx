// File name: context
// File name with extension: context.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\context.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src

import React, { useState, useContext, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { customFetch } from "./utils";
import { App_Config } from "../../shared/globalConfig";
import { toast } from "react-toastify";

const AppContext = React.createContext();

/* 🔐 Session Timeout (30 mins) */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

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

/* 🧠 Safe session helpers */
const session = {
  set: (key, value) => {
    const data = { value, expires: Date.now() + SESSION_TIMEOUT_MS };
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  get: (key) => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() > parsed.expires) {
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    } catch {
      sessionStorage.removeItem(key);
      return null;
    }
  },
  remove: (key) => sessionStorage.removeItem(key),
  clear: () => sessionStorage.clear()
};

/* ✅ Normalize customer object from any source */
const normalizeCustomer = (data) => {
  if (!data || typeof data !== "object") return null;

  let _customer_ = {
    customer_id:
      data.customer_id || data.id || data.user_id || data._id || null,
    cart_id: data.cart_id ?? null,
    name: data.name ?? "Guest",
    email: data.email ?? "",
    role: data.role ?? "user",
    isactive: data.isactive ?? true,
    created_on: data.created_on ?? null
  };
  return _customer_;
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

  /* 🧠 Load Customer Session */
  useEffect(() => {
    try {
      const stored = session.get(App_Config.STORAGE_KEYS.CUSTOMER);
      if (stored) {
        const normalized = normalizeCustomer(stored);

        // ✅ Check if the customer_id matches last session's cart
        const prev = session.get("LAST_CUSTOMER_ID");
        if (prev && prev !== normalized.customer_id) {
          toast.info("Switched user detected. Clearing previous cart.");
          session.clear();
          setCustomer(null);
          return;
        }

        if (normalized?.customer_id && normalized?.cart_id) {
          session.set("LAST_CUSTOMER_ID", normalized.customer_id);
          setCustomer(normalized);
        } else {
          toast.warn("Session expired. Please log in again.");
          session.remove(App_Config.STORAGE_KEYS.CUSTOMER);
        }
      }
    } catch (err) {
      console.error("Session Load Error:", err);
      session.remove(App_Config.STORAGE_KEYS.CUSTOMER);
    } finally {
      setLoading(false);
    }
  }, []);

  /* 💾 Whenever customer changes, re-sync session */
  useEffect(() => {
    if (customer && customer.customer_id && customer.cart_id) {
      session.set(App_Config.STORAGE_KEYS.CUSTOMER, customer);
    }
  }, [customer]);

  /* 🛒 Fetch Cart */
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
          const res = await customFetch.get(App_Config.ENDPOINTS.CART, {
            params: { id: customer.cart_id }
          });

          const raw = res?.data?.data || [];
          console.groupCollapsed("🧾 Cart API Response");
          console.table(raw);
          console.groupEnd();

          if (!Array.isArray(raw) || raw.length === 0) {
            setCart([]);
            return [];
          }

          const normalized = raw.map((item) => ({
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
                : `${App_Config.UPLOAD_URL}/${item.image || "placeholder.jpg"}`,
            cart_id: item.cart_id ?? customer.cart_id
          }));

          setCart(normalized);
          return normalized;
        },
        { showToast, fallback: [] }
      );
    },
    [customer]
  );

  /* 💰 Calculate Total */
  const calculateTotal = useCallback(async () => {
    if (!customer?.cart_id) {
      setPrice({ base: 0, shipping: 0, tax: 0, total: 0 });
      return;
    }

    await safeExec("Total Calculation", async () => {
      const res = await customFetch.get(App_Config.ENDPOINTS.CART, {
        params: { id: customer.cart_id }
      });

      const data = res?.data?.data || [];
      if (!Array.isArray(data) || data.length === 0) {
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
    });
  }, [customer]);

  /* 🔁 Auto Fetch on Customer Change */
  useEffect(() => {
    if (customer?.cart_id) fetchCart(false);
    else setCart([]);
  }, [customer, fetchCart]);

  /* 🚮 Clear Cart after Order */
  const clearCart = useCallback(async () => {
    if (customer?.cart_id) {
      try {
        await customFetch.patch(
          `${App_Config.ENDPOINTS.CART}/delete/${customer.cart_id}`
        );
      } catch (err) {
        console.warn("Server cart clear failed:", err);
      }
    }
    setCart([]);
    setPrice({ base: 0, shipping: 0, tax: 0, total: 0 });
  }, [customer]);

  /* 🔄 Helper: Refresh session manually */
  const refreshSession = useCallback(() => {
    const stored = session.get(App_Config.STORAGE_KEYS.CUSTOMER);
    const normalized = normalizeCustomer(stored);
    if (normalized?.customer_id && normalized?.cart_id) {
      setCustomer(normalized);
    }
  }, []);

  const contextValue = {
    loading,
    customer,
    setCustomer,
    cart,
    fetchCart,
    clearCart,
    price,
    changeAmount,
    setChangeAmount,
    calculateTotal,
    refreshSession
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useGlobalContext = () => useContext(AppContext);
export { AppContext, AppProvider, App_Config, safeExec, session };
