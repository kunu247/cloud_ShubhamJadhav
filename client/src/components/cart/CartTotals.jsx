import { useEffect, } from 'react';
import { useGlobalContext } from '../../context';
import { formatPrice } from '../../utils';


const CartTotals = ({type,handleType}) => {
    const { customer, cart, fetchCart, price, calculateTotal, changeAmount } = useGlobalContext();
    useEffect(() => {
        calculateTotal()
    }, [cart, changeAmount])






    return (
        <>
            <div className='card bg-base-200'>
                <div className="card-body">
                    <p className='flex justify-between text-xs border-b border-base-300 pb-2'>
                        <span>SubTotal </span>
                        <span>{formatPrice(price.base*100)}</span>
                    </p>
                    <p className='flex justify-between text-xs border-b border-base-300 pb-2'>
                        <span>Shipping </span>
                        <span>{formatPrice(price.shipping*100)}</span>
                    </p>
                    <p className='flex justify-between text-xs border-b border-base-300 pb-2'>
                        <span>Tax </span>
                        <span>{formatPrice(price.tax*100)}</span>
                    </p>
                    <p className='mt-4 flex justify-between text-sm pb-2'>
                        <span className='font-bold'>Order </span>
                        <span className='font-bold'>{formatPrice(price.total*100)}</span>
                    </p>
                </div>
            </div>
            <div className='bg-base-200 mt-4 card p-4'>
                <label htmlFor="paymentType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Payment Type</label>
                <select id="paymentType" value={type}  onChange={handleType} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option selected value="default">Choose a Payment Type</option>
                    <option value="upi">Upi</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                </select>
            </div>
        </>
    )
}

export default CartTotals




