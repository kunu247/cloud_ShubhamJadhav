// File name: Login
// File name with extension: Login.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Login.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitBtn } from "../components";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import { useGlobalContext } from "../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCustomer } = useGlobalContext();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.warn("Please enter both email and password.");
      return;
    }

    try {
      const response = await customFetch.post(`/customer/login`, {
        email,
        password
      });

      const data = response?.data;
      const customer = data?.customer;

      if (!customer) {
        toast.error("Invalid login response. Please try again.");
        return;
      }

      // ✅ Store and update context
      localStorage.setItem("customer", JSON.stringify(customer));
      setCustomer(customer);

      toast.success("Logged In Successfully");

      // ✅ Wait for React state update using microtask
      Promise.resolve().then(() => navigate("/"));
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        error?.response?.data?.msg || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <form
        onSubmit={handleLogin}
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered"
        />

        <div className="mt-4">
          <SubmitBtn text="Login" />
        </div>

        <p className="text-center">
          Not a member yet?{" "}
          <Link to="/register" className="ml-2 link link-hover link-primary">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
