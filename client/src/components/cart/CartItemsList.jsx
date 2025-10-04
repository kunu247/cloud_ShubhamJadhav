import React from 'react'
import CartItem from './CartItem';
import { useGlobalContext } from '../../context';

const CartItemsList = () => { 
  const {cart} = useGlobalContext();
  return (
    <div>
      {cart.map((item)=>{
        return <CartItem key={item.product_id} cartItem = {item} />
      })}
    </div>
  )
}

export default CartItemsList