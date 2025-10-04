import React, { useEffect, useState } from 'react'
import { customFetch, formatPrice } from '../../utils';
import AddProducts from './AddProducts'
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products,setProducts] = useState([])
  useEffect(() => {
    customFetch(`/products`)
    .then(response => {
      setProducts(response.data.products)
    })
  },[])
  // const {products} = useLoaderData();
  const [limit,setLimit] = useState({
    lower : 0,
    upper : 10
  });
  const [addProductPage,setAddProductPage] = useState(false);
  if(addProductPage){
    return <AddProducts />
  }
  const deleteProduct = async (id) => {
    try {
      const response = await customFetch.delete(`/products/${id}`);
      const data = await response.data ;
      toast.success("Item Deleted");
      navigate('/admin/product')
    } catch (error) {
      console.log(error);
    }
  } 
  return (
    <div className='mt-8'>

    <div className="flex justify-between">
    <h4 className="capitalize mb-4">
      total products : {products.length}
    </h4>
      <button className="btn btn-primary" onClick={()=>setAddProductPage(true)}>Add Product</button>
    </div>
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Company</th>
            <th>Quantity</th>
            <th>Gender</th>
            <th>Size</th>
            <th >Price</th>
            <th >Edit / Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.slice(limit.lower,limit.upper)?.map((product)=>{
            const id = product.product_id;
            const {product_name,product_company,image,quantity,cost,gender,size} = product;
            return <tr key={id}>
              <td><img src={image} className='w-12 h-12' alt={product_name} /></td>
              <td>{product_name}</td>
              <td>{product_company}</td>
              <td>{quantity}</td>
              <td>{gender==="M"?"Male":"Female"}</td>
              <td>{size}</td>
              <td>{formatPrice(cost)}</td>
              <td className='flex gap-6 text-xl pt-5'>
               <button onClick={()=>{navigate(`/admin/product/${id}`)}}><FaEdit /> </button> 
               <button onClick={()=>deleteProduct(id)}><MdDelete className='text-red-600 text-2xl'/></button>
                </td>
              {/* <td className='hidden sm:block'>{date}</td> */}
            </tr>
          })}
        </tbody>
      </table>
    </div>
    <div>
    <button className="btn-sm rounded outline mt-4 disabled:opacity-25 mr-3" disabled={limit.lower === 0 ? true : false} onClick={()=>{
        setLimit({
        lower : limit.lower - 10,
        upper : limit.upper - 10
      })}}
      >Back</button>
      <button className="btn-sm rounded outline mt-4 disabled:opacity-25" disabled={limit.upper >= products.length ? true : false} onClick={()=>{
        if(limit.upper >= products.length ){
          return toast.warn("No More Customers")
        }
        setLimit({
        lower : limit.lower + 10,
        upper : limit.upper + 10
      })}}
      >Next</button>

    </div>
  </div>
  )
}

export default AdminProducts