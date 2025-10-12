// File name: CartItemsList
// File name with extension: CartItemsList.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\cart\CartItemsList.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\cart

import PropTypes from "prop-types";
import CartItem from "./CartItem";
import { useGlobalContext } from "../../context";

const CartItemsList = () => {
  const { cart } = useGlobalContext();
  return (
    <div>
      {cart.map((item) => {
        return <CartItem key={item.product_id} cartItem={item} />;
      })}
    </div>
  );
};

CartItemsList.propTypes = {
  cart: PropTypes.array
};

export default CartItemsList;
