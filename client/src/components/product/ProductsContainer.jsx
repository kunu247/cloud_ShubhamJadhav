import ProductsGrid from './ProductsGrid';
import { useLoaderData } from 'react-router-dom';

const ProductsContainer = () => {


    const {products} = useLoaderData();
    const totalProducts = products.length;
  return (
    <>
        <div className="flex justify-between items-center mt-8 border-b border-base-300 pb-5">
        <h4 className="font-medium text-md">
          {totalProducts} product{totalProducts > 1 && 's'}
          {/* Total Products = 5 */}
        </h4>
      </div>
       <ProductsGrid /> 
    </>
  )
}

export default ProductsContainer
