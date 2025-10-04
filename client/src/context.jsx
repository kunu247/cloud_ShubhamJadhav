import React, { useState, useContext, useEffect } from "react";
import { customFetch } from "./utils";

const url = `http://localhost:3000/api/v1/`
const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  useEffect(()=>{
    const custLocal = JSON.parse(localStorage.getItem('customer')) || null ;
    setCustomer(custLocal)
  },[])

  const [changeAmount, setChangeAmount] = useState(0);
  const [cart, setCart] = useState([]);
  const [price,setPrice] = useState({
    base : 0,
    shipping : 0,
    tax : 0,
    total : 0
});
  const fetchCart = async () => {
    if(customer){
      const response = await customFetch.get(`cart/${customer.cart_id}`);
      const data = await response.data ;
      setCart(data);
    }
  }
  useEffect(()=>{
    fetchCart();
  },[customer])

  const calculateTotal = async () => {
    if(customer){
    const response = await customFetch.get(`cart/${customer.cart_id}`);
    const data = await response.data ;
    
        let value = 0
        const map1 = data.map((x) =>  { 
             value = value + x.cart_quantity * x.cost;
            return value
        });
        const shipping = 500;
        const tax = (value/100 + shipping)*5/100;
        const totalAmount = value/100 + shipping + tax ;
        setPrice({
            base : value/100,
            shipping : shipping,
            tax : tax,
            total : totalAmount
        })
      }
  }
  // useEffect(()=>{
  //   calculateTotal();
  // },[changeAmount])


  return (
    <AppContext.Provider value={{ loading,  customer, setCustomer, cart, fetchCart, price, changeAmount, setChangeAmount, calculateTotal }}>
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
