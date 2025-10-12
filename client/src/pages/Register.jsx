// File name: Register
// File name with extension: Register.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\pages\Register.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\pages

import { useState } from "react";
import { useGlobalContext, session } from "../context";
import { SubmitBtn } from "../components";
import { Link, useNavigate } from "react-router-dom"; // ✅ only keep what’s used
import { customFetch } from "../utils";
import { toast } from "react-toastify";

const Register = () => {
  const defaultValue = {
    name: "",
    email: "",
    password: "",
    address: "",
    pincode: null,
    phone_number: "",
    role: "user"
  };

  const [registerCustomer, setRegisterCustomer] = useState(defaultValue);
  const { setCustomer } = useGlobalContext(); // ✅ removed unused “customer”
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterCustomer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await customFetch.post(
        "http://localhost:8065/api/v1/customer/register",
        registerCustomer
      );
      const data = response.data;

      // ✅ Clear previous session
      session.clear();
      setCustomer(null);

      // ✅ Save new customer
      session.set("CUSTOMER", data.customer);
      localStorage.setItem("customer", JSON.stringify(data.customer));
      setCustomer(data.customer);

      toast.success("Registered Successfully");
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      const msg =
        error?.response?.data?.msg || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <section className="h-screen grid place-items-center">
      <form
        onSubmit={handleRegister}
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Register</h4>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input input-bordered"
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input input-bordered"
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="pincode"
          placeholder="Pincode"
          className="input input-bordered"
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          className="input input-bordered"
          onChange={handleInputChange}
        />
        <textarea
          name="address"
          cols="30"
          rows="5"
          placeholder="Address"
          onChange={handleInputChange}
          className="input input-bordered"
        ></textarea>

        <div className="mt-4">
          <SubmitBtn text="Register" />
        </div>

        <p className="text-center">
          Already a member?{" "}
          <Link to="/login" className="ml-2 link link-hover link-primary">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
