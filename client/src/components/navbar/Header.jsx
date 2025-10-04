import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context';

const Header = () => {
    const navigate = useNavigate();
    const { customer, setCustomer } = useGlobalContext();
    const handleLogout = () => {
        setCustomer(null);
        localStorage.removeItem('customer')
        navigate('/')
    }
  return (
    <header className=' bg-neutral py-2 text-neutral-content'>
    <div className=" align-element flex justify-center sm:justify-end">
        {customer ? <div className='gap-x-2 sm:gap-x-8 flex items-center'>
            <p className='text-xs sm:text-sm'>Hello, {customer.name}</p>
            <button className="btn btn-primary btn-outline btn-xs uppercase" onClick={handleLogout}>logout</button>
        </div>:
            <div className='flex gap-x-6 justify-center items-center'>
            <Link to='/login' className='link link-hover text-xs sm:text-sm'>
              Login 
            </Link>
            <Link to='/register' className='link link-hover text-xs sm:text-sm'>
              Create an Account
            </Link>
          </div>}

    </div>
  </header>
  )
}

export default Header