import React, { useEffect, useState } from 'react'
import SectionTitle from '../cart/SectionTitle'
import { customFetch, formatPrice } from '../../utils';

import { RiGitRepositoryLine } from "react-icons/ri";
import { LuUsers } from "react-icons/lu";
import { GoCodeSquare } from "react-icons/go";

import { FaRupeeSign } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import DetailsCard from './DetailsCard';

const Dashboard = () => {
  const [details,setDetails] = useState([]);
  const [loading,setLoading] = useState(false);
  const fetchDashboard = async () => {
    try {
      const reponse = await customFetch.get(`/customer/admin`);
      const data = await reponse.data;
      ;
      setDetails(data[0])
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    setLoading(true);
    fetchDashboard();
    setLoading(false)
  },[])
  const newValue = (num) => {
  let totalValue = formatPrice(num);
  totalValue = totalValue.substring(0,totalValue.length - 3);
  return totalValue
  }
  const detailsArray = [{
    id: 1,
    value: details.customer,
    title: 'Total Customers',
    icon: <LuUsers className='w-8 h-8 ' />,
    bgColor: "#f9a8d4",
    color: "#831843"
},
{
    id: 2,
    value: details.product,
    title: 'Total Products',
    icon: <FaShoppingCart className='w-8 h-8 ' />,
    bgColor: "#a5f3fc",
    color: "#164e63"
},
{
    id: 3,
    value: details.payment,
    title: 'Total Orders',
    icon: <FaShoppingBag className='w-8 h-8 ' />,
    bgColor: "#a5b4fc",
    color: "#312e81"
},
{
    id: 4,
    // value: `₹30000000`,
    // value: `₹${details.total}`,
    // value: formatPrice(details.total).substring(0,details.total.toString().length - 2),
    value : newValue(details.total),
    title: 'Total Sales',
    icon: <FaRupeeSign className='w-8 h-8 ' />,
    bgColor: "#fefce8",
    color: "#eab308"
},
  ]
  if(loading){
    return <h1>Loading</h1>
  }

  return (
    <div>
        <div className=" p-6 rounded-lg pb-12">
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Welcome to Admin Panel</h1>
          <SectionTitle text={"Dashboard"} />
          <div className="grid grid-cols-2 justify-between mt-8 flex-wrap gap-y-6 place-items-center">
            {detailsArray.map((item) => {
                return <DetailsCard key={item.id} {...item} />
            })}
        </div>
        </div>
    </div>
  )
}

export default Dashboard