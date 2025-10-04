import React, { useEffect, useState } from 'react'
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';
import day from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

const AdminOrders = () => {
  const [payments,setPayments] = useState([]);
  const [limit,setLimit] = useState({
    lower : 0,
    upper : 10
  });
  const [loading,setLoading] = useState(false);
  const allPayments = async () => {
    try {
      const reponse = await customFetch.get('/payment');
      const data = await reponse.data;
      setPayments(data.payments);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    setLoading(true)
      allPayments();
      setLoading(false);
    }
  ,[])
  if(loading){
    return <h1>Loading</h1>
  }
  return (
    <div className='mt-8'>
      <h4 className="capitalize mb-4">
        total orders : {payments.length}
      </h4>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Customer Name</th>
              <th>Address</th>
              <th>Quantity</th>
              <th>Total</th>
              <th className='hidden sm:block'>Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.slice(limit.lower,limit.upper)?.map((paym)=>{
              const id = paym.payment_id;
              const {name,address, num,names,payment_date, total_amount} = paym;
              const date = day(payment_date).format(' MMM Do, YYYY ');
              return <tr key={id}>
                <td>{names}</td>
                <td>{name}</td>
                <td>{address.substring(0,30)}</td>
                <td>{num}</td>
                <td>&#8377; {total_amount/100}</td>
                <td className='hidden sm:block'>{date}</td>
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
        <button className="btn-sm rounded outline mt-4 disabled:opacity-25" disabled={limit.upper >= payments.length ? true : false} onClick={()=>{
          if(limit.upper >= payments.length ){
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

export default AdminOrders