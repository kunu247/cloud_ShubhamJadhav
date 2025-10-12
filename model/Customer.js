// File name: Customer
// File name with extension: Customer.js
// Full path: E:\cloud_ShubhamJadhav\model\Customer.js
// Directory: E:\cloud_ShubhamJadhav\model

// File: models/Customer.js
class Customer {
  constructor(
    customer_id,
    name,
    email,
    password,
    address,
    pincode,
    phone_number,
    cart_id,
    role = "user",
    created_on = new Date(),
    isactive = true
  ) {
    this.customer_id = customer_id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.address = address;
    this.pincode = pincode;
    this.phone_number = phone_number;
    this.cart_id = cart_id;
    this.role = role;
    this.created_on = created_on;
    this.isactive = isactive;
  }

  static fromDatabase(row) {
    return new Customer(
      row.customer_id,
      row.name,
      row.email,
      row.password,
      row.address,
      row.pincode,
      row.phone_number,
      row.cart_id,
      row.role,
      row.created_on,
      row.isactive
    );
  }

  toSafeObject() {
    const { password, ...safeData } = this;
    return safeData;
  }
}

module.exports = Customer;
