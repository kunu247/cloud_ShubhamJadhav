import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context'
import { CartItemsList, SectionTitle, CartTotals  } from '../components';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';


const Cart = () => {
  const {cart, customer, fetchCart, price} = useGlobalContext();
  const [type, setType] = useState("");
  useEffect(()=>{
    fetchCart
  },[])
  const handleType = (e) => {
    if(e.target.value !== "default"){
      setType(e.target.value);
    }
  }
  const createPayment = async () => {
    event.preventDefault();
    const array = cart.map((item)=>{
      return `${item.product_id}`;
    });
    let str = array.join("','");
    str = "'" + str + "'";
    if(!type){
      toast.error("Please Select Payment Type")
    }else{
    try {
      const response = await customFetch.post(`/payment`,
      {
        payment_type : type,
        customer_id : customer.customer_id,
        cart_id : customer.cart_id,
        product_id : str,
        total_amount : price.total*100
      })
      const data = await response.data ;
      console.log(data);
       toast.success("Order created Successfully");
       fetchCart();
    } catch (error) {
      console.log(error);

    }
  }
  }
  if(cart.length === 0){
    return <div className='align-element pt-20'><SectionTitle text='Your cart is empty' /></div>
  }
  return (
    <>
    <section className='align-element pt-20'>
    <SectionTitle text='Shopping Cart' />
    <div className='mt-8 grid gap-8 lg:grid-cols-12 ' >
      <div className="lg:col-span-8">
        <CartItemsList />
      </div>
      <div className="lg:col-span-4 lg:pl-4">
        <CartTotals type={type} handleType={handleType}/>
        {customer ? <button  className='btn btn-primary btn-block mt-8 uppercase' onClick={createPayment}>Place Your Order</button>
        : <Link to='/login' className='btn btn-primary btn-block mt-8   uppercase'>please Login</Link>}
      </div>
    </div>
    </section>
    </>
  )
}

export default Cart