// File name: Cart
// File name with extension: Cart.js
// Full path: E:\cloud_ShubhamJadhav\model\Cart.js
// Directory: E:\cloud_ShubhamJadhav\model

class Cart {
  constructor(cart_id, created_on = new Date(), isactive = true) {
    this.cart_id = cart_id;
    this.created_on = created_on;
    this.isactive = isactive;
  }

  static fromDatabase(row) {
    return new Cart(row.cart_id, row.created_on, row.isactive);
  }
}

module.exports = Cart;
