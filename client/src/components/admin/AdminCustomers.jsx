import React, { useEffect, useState } from 'react'
import { customFetch } from '../../utils';
import { toast } from 'react-toastify';

const AdminCustomers = () => {
  const [customers,setCustomers] = useState([]);
  const [limit,setLimit] = useState({
    lower : 0,
    upper : 10
  });
  const [loading,setLoading] = useState(false);
  const allCustomers = async () => {
    try {
      const reponse = await customFetch.get('/customer');
      const data = await reponse.data;
      setCustomers(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(()=>{
    setLoading(true)
      allCustomers();
      setLoading(false);
    }
  ,[])
  if(loading){
    return <h1>Loading</h1>
  }
  return (
    <div className='mt-8'>
      <h4 className="capitalize mb-4">
        total customers : {customers.length}
      </h4>
      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th className='hidden sm:block'>Pincode</th>
            </tr>
          </thead>
          <tbody>
            {customers.slice(limit.lower,limit.upper)?.map((cust)=>{
              const id = cust.customer_id;
              const {name,address, phone_number,email,pincode} = cust;
              return <tr key={id}>
                <td>{name}</td>
                <td>{email}</td>
                <td>{address.substring(0,30)}</td>
                <td>{phone_number}</td>
                <td className='hidden sm:block'>{pincode}</td>
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
        <button className="btn-sm rounded outline mt-4 disabled:opacity-25" disabled={limit.upper >= customers.length ? true : false} onClick={()=>{
          if(limit.upper >= customers.length ){
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

export default AdminCustomers