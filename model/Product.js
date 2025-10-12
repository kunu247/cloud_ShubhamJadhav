// File name: Product
// File name with extension: Product.js
// Full path: E:\cloud_ShubhamJadhav\model\Product.js
// Directory: E:\cloud_ShubhamJadhav\model

// File: models/Product.js
class Product {
  constructor(
    product_id,
    product_name,
    product_company,
    color = null,
    size = null,
    gender = "U",
    cost,
    quantity,
    image = null,
    created_on = new Date(),
    isactive = true
  ) {
    this.product_id = product_id;
    this.product_name = product_name;
    this.product_company = product_company;
    this.color = color;
    this.size = size;
    this.gender = gender;
    this.cost = cost;
    this.quantity = quantity;
    this.image = image;
    this.created_on = created_on;
    this.isactive = isactive;
  }

  static fromDatabase(row) {
    return new Product(
      row.product_id,
      row.product_name,
      row.product_company,
      row.color,
      row.size,
      row.gender,
      row.cost,
      row.quantity,
      row.image,
      row.created_on,
      row.isactive
    );
  }
}

module.exports = Product;
