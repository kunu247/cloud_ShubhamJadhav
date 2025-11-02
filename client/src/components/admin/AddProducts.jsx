// File name: AddProducts
// File name with extension: AddProducts.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\admin\AddProducts.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\admin

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  // const navigate = useNavigate();

  const defaultValue = {
    id: null,
    product_name: "",
    product_company: "",
    color: "",
    size: "",
    gender: "",
    cost: "",
    quantity: "",
    image: ""
  };

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [newProduct, setNewProduct] = useState(defaultValue);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Load products from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("products");
    try {
      const parsed = stored ? JSON.parse(stored) : [];
      setProducts(Array.isArray(parsed) ? parsed : []);
    } catch {
      setProducts([]);
    }
  }, []);

  const saveToStorage = (updatedList) => {
    localStorage.setItem("products", JSON.stringify(updatedList));
    setProducts(updatedList);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const addImage = async () => {
    if (!selectedImage) return toast.error("Select an image first");
    try {
      const base64 = await convertToBase64(selectedImage);
      setNewProduct((prev) => ({ ...prev, image: base64 }));
      setImageSrc(base64);
      toast.success("Image added successfully");
    } catch (err) {
      console.error(err);
      toast.error("Image processing failed");
    }
  };

  const submitProduct = (e) => {
    e.preventDefault();
    const values = Object.values(newProduct);
    if (values.some((v) => v === "" || v === null)) {
      return toast.error("All input fields must be filled");
    }

    if (!imageSrc) return toast.error("Upload image first");

    let updatedList = [];
    if (editMode) {
      updatedList = products.map((p) =>
        p.id === newProduct.id ? newProduct : p
      );
      toast.success("Product updated successfully");
    } else {
      const id = Date.now();
      updatedList = [...products, { ...newProduct, id }];
      toast.success("Product added successfully");
    }

    saveToStorage(updatedList);
    setNewProduct(defaultValue);
    setImageSrc(null);
    setSelectedImage(null);
    setEditMode(false);
  };

  const handleEdit = (product) => {
    setNewProduct(product);
    setImageSrc(product.image);
    setEditMode(true);
    toast.info("Editing product");
  };

  const handleDelete = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveToStorage(updated);
    toast.warn("Product deleted");
  };

  const handleReset = () => {
    setNewProduct(defaultValue);
    setEditMode(false);
    setImageSrc(null);
    setSelectedImage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full pt-4 justify-around gap-6">
      {/* FORM SECTION */}
      <section className="grid place-items-center">
        <form
          className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
          onSubmit={submitProduct}
        >
          <h4 className="text-center text-3xl font-bold">
            {editMode ? "Edit Product" : "Add Product"}
          </h4>

          <input
            type="text"
            name="product_name"
            placeholder="Product Name"
            className="input input-bordered"
            value={newProduct.product_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="product_company"
            placeholder="Company Name"
            className="input input-bordered"
            value={newProduct.product_company}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            className="input input-bordered"
            value={newProduct.color}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            className="input input-bordered"
            value={newProduct.quantity}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="cost"
            placeholder="Price"
            className="input input-bordered"
            value={newProduct.cost}
            onChange={handleInputChange}
          />
          <select
            id="Gender"
            name="gender"
            onChange={handleInputChange}
            value={newProduct.gender}
            className="select select-bordered"
          >
            <option value="">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <select
            id="Size"
            name="size"
            onChange={handleInputChange}
            value={newProduct.size}
            className="select select-bordered"
          >
            <option value="">Size in UK Standard</option>
            {[5, 6, 7, 8, 9, 10, 11].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={!imageSrc}
          >
            {editMode ? "Update Product" : "Add Product"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="btn btn-outline btn-sm mt-1"
          >
            Reset
          </button>
        </form>
      </section>

      {/* IMAGE SECTION */}
      <div className="w-[30rem] bg-base-100 p-8 card">
        <div className="flex flex-col justify-center w-full">
          <label
            className="block font-bold mx-auto text-3xl mb-5 text-gray-900"
            htmlFor="myImage"
          >
            Upload Image
          </label>
          <input
            type="file"
            name="myImage"
            accept="image/*"
            className="block w-9/10 text-xl mb-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
            onChange={(e) => setSelectedImage(e.target.files[0])}
          />
          <p className="mt-1 text-lg mb-5 text-gray-500">
            PNG, JPG, or GIF (MAX. 1MB)
          </p>
          <button
            type="button"
            className="btn btn-secondary mx-auto mb-4 btn-sm w-56"
            onClick={() => {
              setSelectedImage(null);
              setImageSrc(null);
            }}
          >
            Remove Image
          </button>
        </div>

        {selectedImage && (
          <div className="mt-2">
            <img
              alt="preview"
              width="450"
              src={URL.createObjectURL(selectedImage)}
            />
          </div>
        )}

        {imageSrc && (
          <div className="mt-2">
            <img alt="uploaded" width="450" src={imageSrc} />
          </div>
        )}

        <div className="flex">
          <button
            type="button"
            className="btn mt-5 btn-primary btn-block"
            onClick={addImage}
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="w-full lg:w-[40rem] mt-10 lg:mt-0">
        <h3 className="text-2xl font-semibold mb-3">Stored Products</h3>
        {products.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Cost</th>
                  <th>Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.product_name}</td>
                    <td>{p.product_company}</td>
                    <td>{p.cost}</td>
                    <td>{p.quantity}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-xs btn-warning"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProducts;
