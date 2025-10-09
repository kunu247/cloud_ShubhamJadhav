// File name: index
// File name with extension: index.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\utils\index.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\utils

import axios from "axios";
import { App_Config, getApiUrl } from "../../../shared/globalConfig";

export const customFetch = axios.create({
  baseURL: App_Config.API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

export const getImageUrl = (imgFile) =>
  imgFile?.startsWith("http")
    ? imgFile
    : `${App_Config.UPLOAD_URL}/${imgFile || "placeholder.jpg"}`;

export const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR"
  }).format((price / 100).toFixed(2));

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

export { App_Config as _CONFIG_, getApiUrl as GET_URL };
