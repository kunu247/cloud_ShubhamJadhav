import axios from "axios";

// const productionUrl = 'https://strapi-store-server.onrender.com/api';
const productionUrl = 'http://localhost:3000/api/v1/';

export const customFetch  = axios.create({
    baseURL : productionUrl,
    headers : 'application/json'
});

export const formatPrice = (price) => {
    const dollarsAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
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