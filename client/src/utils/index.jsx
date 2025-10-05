// File name: index
// File name with extension: index.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\utils\index.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\utils

import axios from "axios";

// const productionUrl = 'https://strapi-store-server.onrender.com/api';
const baseURL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const customFetch = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" }
});

export const formatPrice = (price) => {
  const dollarsAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR"
  }).format((price / 100).toFixed(2));
  return dollarsAmount;
};

export const generateAmountOptions = (number) => {
  return Array.from({ length: number }, (_, index) => {
    const amount = index + 1;

    return (
      <option key={amount} value={amount}>
        {amount}
      </option>
    );
  });
};
