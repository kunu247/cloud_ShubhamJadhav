// File name: AdminSingleProduct
// File name with extension: AdminSingleProduct.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AdminSingleProduct.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const STORAGE_KEY = "admin_products";

const AdminSingleProduct = () => {
  const [product, setProduct] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = () => {
      try {
        const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const foundProduct = products.find((p) => p.id === parseInt(id));

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          toast.error("Product not found");
          navigate("/admin/products");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to fetch product details");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "gender" && value === "default") {
      return toast.error("Please Select Gender");
    }
    if (name === "size" && value === "default") {
      return toast.error("Please Select Size");
    }
    setProduct((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const updateProduct = () => {
    try {
      const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updatedProducts = products.map((p) =>
        p.id === parseInt(id) ? { ...product } : p
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
      toast.success("Product Successfully Updated");
      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const submitProduct = (event) => {
    event.preventDefault();

    const values = Object.values(product);
    const isIncomplete = values.some((val) => val === "" || val === null);

    if (isIncomplete) {
      return toast.error("All Input Fields Not Filled");
    }

    updateProduct();
  };

  return (
    <div className="flex w-full pt-4 justify-around">
      <section className="h-screen grid place-items-center">
        <form
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
          onSubmit={submitProduct}
        >
          <h4 className="text-center text-3xl font-bold">Product Details</h4>

          <input
            type="text"
            name="product_name"
            placeholder="Product Name"
            className="input input-bordered"
            onChange={handleInputChange}
            value={product.product_name || ""}
          />

          <input
            type="text"
            name="product_company"
            placeholder="Company Name"
            className="input input-bordered"
            onChange={handleInputChange}
            value={product.product_company || ""}
          />

          <input
            type="text"
            name="color"
            placeholder="Color"
            className="input input-bordered"
            onChange={handleInputChange}
            value={product.color || ""}
          />

          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="input input-bordered"
            onChange={handleInputChange}
            value={product.quantity || ""}
          />

          <input
            type="number"
            name="cost"
            placeholder="Price"
            className="input input-bordered"
            onChange={handleInputChange}
            value={product.cost || ""}
          />

          <select
            name="gender"
            onChange={handleInputChange}
            value={product.gender || "default"}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="default">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>

          <select
            name="size"
            onChange={handleInputChange}
            value={product.size || "default"}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="default">Size In UK Standard</option>
            {[5, 6, 7, 8, 9, 10, 11].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div className="mt-4">
            <button className="btn btn-primary btn-block">
              Update Product
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AdminSingleProduct;
