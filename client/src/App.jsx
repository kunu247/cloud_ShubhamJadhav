// File name: App
// File name with extension: App.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\App.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src

import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalContext } from "./context";
import { App_Config } from "@shared/globalConfig";

// 🧩 Lazy load major pages for performance boost
const HomeLayout = lazy(() => import("./pages/HomeLayout"));
const Landing = lazy(() => import("./pages/Landing"));
const Products = lazy(() => import("./pages/Products"));
const SingleProduct = lazy(() => import("./pages/SingleProduct"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Orders = lazy(() => import("./pages/Orders"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Admin = lazy(() => import("./pages/Admin"));
const Error = lazy(() => import("./pages/Error"));

// 🧭 Components
import {
  AdminCustomers,
  AdminOrders,
  AdminProducts,
  AdminSingleProduct,
  Dashboard,
  ErrorElement
} from "./components";

import { loader as productLoader } from "./pages/Products";

// 🧩 Route factory for reusability
const createRoute = (path, element, options = {}) => ({
  path,
  element,
  errorElement: options.errorElement || <ErrorElement />,
  loader: options.loader || null,
  children: options.children || []
});

function App() {
  const { APP_NAME } = useGlobalContext();

  // 🗺️ Define all routes cleanly
  const router = createBrowserRouter([
    createRoute("/", <HomeLayout />, {
      errorElement: <Error />,
      children: [
        createRoute("", <Landing />),
        createRoute("products", <Products />, { loader: productLoader }),
        createRoute("products/:id", <SingleProduct />),
        createRoute("cart", <Cart />),
        createRoute("checkout", <Checkout />),
        createRoute("orders", <Orders />),
        createRoute("admin", <Admin />, {
          children: [
            createRoute("", <Dashboard />),
            createRoute("customer", <AdminCustomers />),
            createRoute("product", <AdminProducts />, {
              loader: productLoader
            }),
            createRoute("product/:id", <AdminSingleProduct />),
            createRoute("order", <AdminOrders />)
          ]
        })
      ]
    }),
    createRoute("login", <Login />, { errorElement: <Error /> }),
    createRoute("register", <Register />, { errorElement: <Error /> })
  ]);

  // 🧭 Global constants (example usage)
  console.log(`Welcome to ${APP_NAME}!`);
  console.info(`🚀 ${App_Config.APP_NAME} (${App_Config.VERSION}) initialized`);
  console.info(`🌐 API Base: ${App_Config.API_URL}`);

  return (
    <>
      <ToastContainer position="top-center" theme="colored" autoClose={3000} />
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

export default React.memo(App);
