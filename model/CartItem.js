// File name: CartItem
// File name with extension: CartItem.js
// Full path: E:\cloud_ShubhamJadhav\model\CartItem.js
// Directory: E:\cloud_ShubhamJadhav\model

class CartItem {
  constructor(
    cart_id,
    product_id,
    cart_quantity,
    date_added,
    purchased = "NO",
    created_on = new Date(),
    isactive = true,
    product_name = null,
    product_company = null,
    cost = null,
    image = null,
    color = null,
    size = null
  ) {
    this.cart_id = cart_id;
    this.product_id = product_id;
    this.cart_quantity = cart_quantity;
    this.date_added = date_added;
    this.purchased = purchased;
    this.created_on = created_on;
    this.isactive = isactive;
    this.product_name = product_name;
    this.product_company = product_company;
    this.cost = cost;
    this.image = image;
    this.color = color;
    this.size = size;
  }

  static fromDatabase(row) {
    return new CartItem(
      row.cart_id,
      row.product_id,
      row.cart_quantity,
      row.date_added,
      row.purchased,
      row.created_on,
      row.isactive,
      row.product_name,
      row.product_company,
      row.cost,
      row.image,
      row.color,
      row.size
    );
  }
}

module.exports = CartItem;
