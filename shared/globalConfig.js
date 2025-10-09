// File name: globalConfig
// File name with extension: globalConfig.js
// Full path: E:\cloud_ShubhamJadhav\shared\globalConfig.js
// Directory: E:\cloud_ShubhamJadhav\shared

// ✅ Detect environment safely across Node.js and Browser
const isBrowser = typeof window !== "undefined";
const isNode = typeof process !== "undefined" && process?.versions?.node;

// 🧠 Safe getter for environment variables (works in both Node.js + Vite)
const getEnv = (key, fallback = undefined) => {
  if (isBrowser && typeof import.meta !== "undefined") {
    return import.meta.env?.[key] ?? fallback;
  }
  if (isNode && process?.env) {
    return process.env[key] ?? fallback;
  }
  return fallback;
};

export const App_Config = {
  APP_NAME: "FootwareApp",
  VERSION: "v2.0.0",
  DEV_MODE:
    getEnv("MODE") === "development" ||
    getEnv("NODE_ENV") === "development" ||
    false,

  // 🌐 Base URLs
  API_URL:
    getEnv("VITE_API_BASE_URL") ||
    getEnv("API_BASE_URL") ||
    "http://localhost:8065/api/v1",

  UPLOAD_URL:
    getEnv("VITE_UPLOAD_URL") ||
    getEnv("UPLOAD_URL") ||
    "http://localhost:8065/uploads",

  // 🔗 Static endpoints
  ENDPOINTS: {
    PRODUCTS: "/products",
    PRODUCT: (id) => `/products/${id}`,
    CART: "/cart",
    CART_BY_ID: (id) => `/cart/${id}`,
    CUSTOMER: "/customer",
    CUSTOMER_ADMIN: "/customer/admin",
    PAYMENT: "/payment",
    LOGIN: "/customer/login",
    REGISTER: "/customer/register"
  },

  // ⚙️ Default settings
  LIMITS: {
    PAGE_SIZE: 10
  },

  // 💾 LocalStorage keys
  STORAGE_KEYS: {
    CUSTOMER: "customer",
    THEME: "theme"
  }
};

// 🌐 Universal helper for consistent API path resolution
export const getApiUrl = (endpoint = "") => {
  const base = App_Config.API_URL.replace(/\/$/, "");
  const clean = endpoint.replace(/^\//, "");
  return `${base}/${clean}`;
};
