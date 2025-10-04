import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const AdminSingleProduct = () => {
  //   const defaultValue = {
  //   "product_name": "",
  //   "product_company": "",
  //   "color": "",
  //   "size": null,
  //   "gender": "",
  //   "cost": null,
  //   "quantity": null,
  //   "image": ""
  // }
  const [newProduct, setNewProduct] = useState({});
  const navigate = useNavigate();
    const {id} = useParams();
  useEffect(() => {
    customFetch(`/products/${id}`)
    .then(response => {
      setNewProduct(response.data[0])
    })
  },[])



  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "gender" && value === "default") {
      return toast.error("Please Select Gender")
    }
    if (name === "size" && value === "default") {
      return toast.error("Please Select Size")
    }
    setNewProduct({
      ...newProduct,
      [name]: value,
    });

  }

  const updateProduct = async () => {
    try {
      const response = await customFetch.patch(`/products/${id}`, newProduct);
      const data = await response.data;
    } catch (error) {
      console.log(error);
    }
  }
  const submitProduct = () => {
    event.preventDefault();
    const values = Object.values(newProduct);
    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      if (element === '' || element === null) {
        index = values.length;
        return toast.error("All Input Fields Not Filled")
      }
    }
    updateProduct();
    toast.success("Product Successfully Updated");
    navigate('/admin/product')
  }
  return (
    <div className="flex w-full pt-4 justify-around">
      <section className='h-screen grid place-items-center'>
        <form className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4' onSubmit={submitProduct}>
          <h4 className='text-center text-3xl font-bold'>Product Details</h4>
          <input type="text" name='product_name' placeholder='Product Name' className='input input-bordered' onChange={handleInputChange} defaultValue={newProduct.product_name}/>
          <input type="text" name='product_company' placeholder='Company Name' className='input input-bordered' onChange={handleInputChange} defaultValue={newProduct.product_company}/>
          <input type="text" name='color' placeholder='Color' className='input input-bordered' onChange={handleInputChange} defaultValue={newProduct.color}/>
          <input type="number" name='quantity' placeholder='Quantity' className='input input-bordered' onChange={handleInputChange} defaultValue={newProduct.quantity}/>
          <input type="number" name='cost' placeholder='Price' className='input input-bordered' onChange={handleInputChange} defaultValue={newProduct.cost}/>
          <select id="Gender" placeholder="Gender" name='gender' onChange={handleInputChange} defaultValue={newProduct.gender} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value="default">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <select id="Size" name='size' onChange={handleInputChange} defaultValue={newProduct.size} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
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
            <button  className="btn btn-primary btn-block"  > Update Product </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default AdminSingleProduct