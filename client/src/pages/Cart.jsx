// File name: Cart
// File name with extension: Cart.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Cart.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { CartItemsList, SectionTitle, CartTotals } from "../components";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils";

const Cart = () => {
  const { cart, customer, fetchCart, price } = useGlobalContext();
  const [type, setType] = useState("default");

  /*  Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, []);
  */

  useEffect(() => {
    fetchCart().then((data) => {
      console.log("🧾 Cart after fetch:", data);
    });
  }, []);

  /*
  const handleType = (e) => {
    const val = e.target.value;
    if (val && val !== "default") setType(val);
  };
  */
  const handleType = (e) => setType(e.target.value);

  const createPayment = async (event) => {
    event.preventDefault();

    if (!customer) {
      toast.error("Please log in first.");
      return;
    }
    if (!type) {
      toast.error("Please select payment type.");
      return;
    }
    if (!cart.length) {
      toast.warn("Your cart is empty.");
      return;
    }

    try {
      const productIds = cart.map((item) => `'${item.product_id}'`).join(",");
      const response = await customFetch.post(`/payment`, {
        payment_type: type,
        customer_id: customer.customer_id,
        cart_id: customer.cart_id,
        product_id: productIds,
        total_amount: price.total * 100
      });

      const data = response?.data;
      if (data?.success) {
        toast.success("Order placed successfully!");
        fetchCart();
      } else {
        toast.warn(data?.msg || "Order not created.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Payment failed. Try again.");
    }
  };

  if (!cart?.length) {
    return (
      <div className="align-element pt-20">
        <SectionTitle text="Your cart is empty" />
      </div>
    );
  }

  return (
    <section className="align-element pt-20">
      <SectionTitle text="Shopping Cart" />
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <CartItemsList />
        </div>
        <div className="lg:col-span-4 lg:pl-4">
          <CartTotals type={type} handleType={handleType} />
          {customer ? (
            <button
              className="btn btn-primary btn-block mt-8 uppercase"
              onClick={createPayment}
            >
              Place Your Order
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary btn-block mt-8 uppercase"
            >
              Please Login
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cart;
