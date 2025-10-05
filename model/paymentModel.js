// File name: paymentModel
// File name with extension: paymentModel.js
// Full path: E:\cloud_ShubhamJadhav\model\paymentModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");

async function getAllpaymentsSql() {
  const pool = await poolPromise;
  const payments = (await pool.request().query("SELECT * FROM Payment"))
    .recordset;
  const enriched = [];

  for (const p of payments) {
    const [{ names } = {}] = (
      await pool
        .request()
        .input("cart_id", sql.VarChar(7), p.cart_id)
        .input("payment_id", sql.VarChar(10), p.payment_id)
        .query(`SELECT STRING_AGG(product_name, ', ') AS names
              FROM Product WHERE product_id IN (
                SELECT product_id FROM Cart_item
                WHERE cart_id=@cart_id AND purchased=@payment_id)`)
    ).recordset;

    const [{ num } = {}] = (
      await pool
        .request()
        .input("cart_id", sql.VarChar(7), p.cart_id)
        .input("payment_id", sql.VarChar(10), p.payment_id)
        .query(`SELECT SUM(cart_quantity) AS num
              FROM Cart_item WHERE cart_id=@cart_id AND purchased=@payment_id`)
    ).recordset;

    const [{ name, address } = {}] = (
      await pool
        .request()
        .input("customer_id", sql.VarChar(7), p.customer_id)
        .query(
          "SELECT name,address FROM Customer WHERE customer_id=@customer_id"
        )
    ).recordset;

    enriched.push({
      ...p,
      product_names: names || "",
      total_items: num || 0,
      customer_name: name || "",
      address: address || ""
    });
  }
  return enriched;
}

async function createPaymentSql(
  payment_type,
  customer_id,
  cart_id,
  product_ids,
  total_amount
) {
  const pool = await poolPromise;
  const payment_id = new ShortUniqueId({ length: 7 }).rnd();
  const date = new Date().toISOString().split("T")[0];

  await pool
    .request()
    .input("payment_id", sql.VarChar(10), payment_id)
    .input("payment_date", sql.Date, date)
    .input("payment_type", sql.VarChar(20), payment_type)
    .input("customer_id", sql.VarChar(7), customer_id)
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("total_amount", sql.Int, total_amount)
    .query(`INSERT INTO Payment (payment_id,payment_date,payment_type,customer_id,cart_id,total_amount)
            VALUES (@payment_id,@payment_date,@payment_type,@customer_id,@cart_id,@total_amount)`);

  await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("payment_id", sql.VarChar(10), payment_id)
    .query("UPDATE Cart_item SET purchased=@payment_id WHERE cart_id=@cart_id");

  return { payment_id, payment_date: date, total_amount };
}

async function getSinglePaymentSql(cart_id) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .query("SELECT * FROM Payment WHERE cart_id=@cart_id");
  return recordset;
}

module.exports = { getAllpaymentsSql, createPaymentSql, getSinglePaymentSql };
