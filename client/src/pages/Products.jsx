import React from 'react'
import { ProductsContainer } from '../components'
import { customFetch } from '../utils';

export const loader =  async () => {
  const response = await customFetch('/products')
  const products = await response.data.products;
  return {products};
}

const Products = () => {
  return (
    <div className='align-element pt-20'>
      <ProductsContainer />
    </div>
  )
}

export default Products