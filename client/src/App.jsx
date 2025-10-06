// File name: App
// File name with extension: App.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\App.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src

import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Cart,
  Checkout,
  Error,
  HomeLayout,
  Landing,
  Login,
  Orders,
  Products,
  Register,
  SingleProduct,
  Admin
} from "./pages";
import {
  AdminCustomers,
  AdminOrders,
  AdminProducts,
  AdminSingleProduct,
  Dashboard,
  ErrorElement
} from "./components";
import { useGlobalContext } from "./context";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { loader as productLoader } from "./pages/Products";

function App() {
  const [count, setCount] = useState(0);
  const { cocktails, loading } = useGlobalContext();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Landing />,
          errorElement: <ErrorElement />
        },
        {
          path: "/products",
          element: <Products />,
          errorElement: <ErrorElement />,
          loader: productLoader
        },
        {
          path: "/products/:id",
          element: <SingleProduct />,
          errorElement: <ErrorElement />
        },
        {
          path: "/cart",
          element: <Cart />
        },
        {
          path: "/checkout",
          element: <Checkout />
        },
        {
          path: "/orders",
          element: <Orders />
        },
        {
          path: "/admin",
          element: <Admin />,
          children: [
            { index: true, element: <Dashboard /> },
            { path: "customer", element: <AdminCustomers /> },
            {
              path: "product",
              element: <AdminProducts />,
              loader: productLoader
            },
            { path: "product/:id", element: <AdminSingleProduct /> },
            { path: "order", element: <AdminOrders /> }
          ]
        }
      ]
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <Error />
    },
    {
      path: "/register",
      element: <Register />,
      errorElement: <Error />
    }
  ]);

  return (
    <>
      <ToastContainer className="self-center" position="top-center" />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
