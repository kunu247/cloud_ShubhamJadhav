// File name: Orders
// File name with extension: Orders.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Orders.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SectionTitle, OrderList } from "../components";
import { customFetch } from "../utils";

const Orders = () => {
  const { customer } = useGlobalContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      toast.error("Please login to view orders.");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [customer]);

  const fetchOrders = async () => {
    try {
      const res = await customFetch.get(`/payment/${customer.cart_id}`);
      const data = res?.data;
      if (!data || !data.payments) {
        toast.info("No orders found.");
        setPayments([]);
        return;
      }
      setPayments(data.payments);
    } catch (error) {
      console.error("Orders Fetch Error:", error);
      toast.error("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="align-element pt-20 text-center">
        <SectionTitle text="Loading Orders..." />
      </div>
    );

  if (!payments.length) {
    return (
      <div className="align-element pt-20">
        <SectionTitle text="No Orders Found" />
      </div>
    );
  }

  return (
    <section className="align-element pt-20">
      <SectionTitle text="Your Orders" />
      <OrderList payments={payments} />
    </section>
  );
};

export default Orders;
