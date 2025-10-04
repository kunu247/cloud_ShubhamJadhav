import React, { useState } from 'react'
import { useGlobalContext } from '../context';
import { SubmitBtn } from '../components';
import { Form, Link,  redirect, useNavigate, useSearchParams } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';

const Register = () => {
  const defaultValue = {
    "name" : "",
    "email" : "",
    "password" : "",
    "address" : "",
    "pincode" : null,
    "phone_number" : "",
    "role" : "user"
  }
  const [registerCustomer,setRegisterCustomer] = useState(defaultValue);
  const {customer, setCustomer} = useGlobalContext();
  const navigate = useNavigate();


  const handleInputChange = (e) => {
    //const name = e.target.name 
    //const value = e.target.value 
    const { name, value } = e.target;

    setRegisterCustomer({
      ...registerCustomer,
      [name]: value,
    });
  };


  const handleRegister = async () => {
    event.preventDefault();
    try {

      const response = await customFetch.post('http://localhost:3000/api/v1/customer/register',registerCustomer);
      const data = await response.data;
      ;
      localStorage.setItem('customer',JSON.stringify(data.customer));
      setCustomer(data.customer);
      toast.success("Registered  Successfully");
      navigate('/');


  } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.msg);
  }


  }

  return (
    <section className='h-screen grid place-items-center'>
    <form  onSubmit={handleRegister} className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'>
        <h4 className='text-center text-3xl font-bold'>Register</h4>
        <input type="text" name='name' placeholder='Name' className='input input-bordered' onChange={handleInputChange}/>
        <input type="text" name='email' placeholder='Email'   className='input input-bordered' onChange={handleInputChange}/>
        <input type="text" name='password' placeholder='Password'   className='input input-bordered'  onChange={handleInputChange}/>
        <input type="number" name='pincode' placeholder='Pincode' className='input input-bordered' onChange={handleInputChange} />
        <input type="text" name='phone_number' placeholder='Phone Number'   className='input input-bordered'  onChange={handleInputChange}/>
        <textarea name="address" id="" cols="30" placeholder='Address' rows="10" onChange={handleInputChange} className='input input-bordered' ></textarea>
        <div className="mt-4">
            <SubmitBtn text='Register'  />
        </div>
        <p className="text-center">
            Already a member <Link to='/login' className='ml-2 link link-hover link-primary'>Login</Link>
        </p>
    </form>
</section>
  )
}

export default Register