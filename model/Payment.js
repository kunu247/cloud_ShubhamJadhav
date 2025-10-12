// File name: Payment
// File name with extension: Payment.js
// Full path: E:\cloud_ShubhamJadhav\model\Payment.js
// Directory: E:\cloud_ShubhamJadhav\model

class Payment {
  constructor(
    payment_id,
    payment_date,
    payment_type,
    customer_id,
    cart_id,
    product_ids = [],
    total_amount,
    created_on = new Date(),
    isactive = true,
    product_names = "",
    total_items = 0,
    customer_name = "",
    address = ""
  ) {
    this.payment_id = payment_id;
    this.payment_date = payment_date;
    this.payment_type = payment_type;
    this.customer_id = customer_id;
    this.cart_id = cart_id;
    this.product_ids = Array.isArray(product_ids)
      ? product_ids
      : this.safeParse(product_ids);
    this.total_amount = total_amount;
    this.created_on = created_on;
    this.isactive = isactive;
    this.product_names = product_names;
    this.total_items = total_items;
    this.customer_name = customer_name;
    this.address = address;
  }

  /**
   * Safe JSON parser fallback for string data
   */
  safeParse(raw) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return typeof raw === "string" ? raw.split(",").map((p) => p.trim()) : [];
    }
  }

  static fromDatabase(row) {
    return new Payment(
      row.payment_id,
      row.payment_date,
      row.payment_type,
      row.customer_id,
      row.cart_id,
      row.product_ids,
      row.total_amount,
      row.created_on,
      row.isactive,
      row.product_names,
      row.total_items,
      row.customer_name,
      row.address
    );
  }
}

module.exports = Payment;
