// File name: AddProducts
// File name with extension: AddProducts.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AddProducts.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import React, { useState } from "react";
import { customFetch } from "../../utils";
import SubmitBtn from "../form/SubmitBtn";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const navigate = useNavigate();
  const defaultValue = {
    product_name: "",
    product_company: "",
    color: "",
    size: null,
    gender: "",
    cost: null,
    quantity: null,
    image: ""
  };
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [newProduct, setNewProduct] = useState(defaultValue);

  const addImage = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const resp = await customFetch.post(`/products/uploads`, formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });
      const data = await resp.data;
      setNewProduct({
        ...newProduct,
        image: data.image.src
      });
      setImageSrc(data.image.src);
      toast.success("Image Uploaded Successfully");
    } catch (error) {
      console.log(error);
      toast.warn(error.response.data.image.msg);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "gender" && value === "default") {
      return toast.error("Please Select Gender");
    }
    if (name === "size" && value === "default") {
      return toast.error("Please Select Size");
    }
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  const postProduct = async () => {
    try {
      const response = await customFetch.post("/products", newProduct);
      const data = await response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const submitProduct = () => {
    event.preventDefault();
    const values = Object.values(newProduct);
    if (values[7] === "") {
      return toast.error("Image Not Uploaded");
    }
    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      if (element === "" || element === null) {
        index = values.length;
        return toast.error("All Input Fields Not Filled");
      }
    }
    postProduct();
    toast.success("Product Successfully Added");
    navigate("/admin/product");
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
          />
          <input
            type="text"
            name="product_company"
            placeholder="Company Name"
            className="input input-bordered"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            className="input input-bordered"
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="input input-bordered"
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="cost"
            placeholder="Price"
            className="input input-bordered"
            onChange={handleInputChange}
          />
          <select
            id="Gender"
            placeholder="Gender"
            name="gender"
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="default">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <select
            id="Size"
            name="size"
            onChange={handleInputChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="default">Size In UK Standard</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
          <div className="mt-4">
            {/* <SubmitBtn text='Add Product'  disabled={selectedImage===null?true:false}/> */}
            <button
              text="Add Product"
              className="btn btn-primary btn-block"
              disabled={imageSrc === null ? true : false}
            >
              {imageSrc ? "Add product" : "Upload Image First"}
            </button>
          </div>
        </form>
      </section>
      <div className="w-[30rem] bg-base-100  p-8 card">
        <div className="flex justify-center flex-col w-full">
          <label
            className="block font-bold mx-auto  text-3xl  mb-5 text-gray-900 dark:text-white"
            htmlFor="myImage"
          >
            Upload Image
          </label>
          <input
            type="file"
            name="myImage"
            className="block w-9/10 text-xl mb-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            //  onChange={addImage}
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
          <p
            className="mt-1 text-lg mb-5  text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            SVG, PNG, JPG or GIF (MAX. 1MB).
          </p>
          <button
            className="btn btn-secondary mx-auto mb-4 btn-sm w-56"
            onClick={() => setSelectedImage(null)}
          >
            Remove Image
          </button>
        </div>
        <div>
          {selectedImage && (
            <div>
              <img
                alt="not found"
                width={"450px"}
                src={URL.createObjectURL(selectedImage)}
              />
            </div>
          )}
          <div className="flex">
            <button
              className="btn mt-5 btn-primary btn-block"
              onClick={addImage}
            >
              Upload Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
