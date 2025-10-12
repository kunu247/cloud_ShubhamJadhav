// File name: paymentModel
// File name with extension: paymentModel.js
// Full path: E:\cloud_ShubhamJadhav\model\paymentModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");
const Payment = require("./Payment");
const ApiResponse = require("./ApiResponse");

/* ---------------------- SQL QUERY CONSTANTS ---------------------- */
const QUERY = {
  SELECT_ALL_ACTIVE: "SELECT * FROM [dbo].[Payment] WHERE [isactive] = 1;",
  INSERT_PAYMENT: `
    INSERT INTO Payment 
    (payment_id, payment_date, payment_type, customer_id, cart_id, product_ids, total_amount)
    VALUES (@payment_id, @payment_date, @payment_type, @customer_id, @cart_id, @product_ids, @total_amount)
  `,
  UPDATE_CART_ITEMS_PURCHASED:
    "UPDATE Cart_item SET purchased=@payment_id WHERE cart_id=@cart_id;",
  SELECT_SINGLE_PAYMENT:
    "SELECT * FROM Payment WHERE cart_id=@cart_id AND isactive = 1;",
  SELECT_PRODUCT_NAMES: `
    SELECT STRING_AGG(product_name, ', ') AS names
    FROM Product WHERE product_id IN (
      SELECT product_id FROM Cart_item
      WHERE cart_id=@cart_id AND purchased=@payment_id
    );
  `,
  SELECT_TOTAL_ITEMS: `
    SELECT SUM(cart_quantity) AS num
    FROM Cart_item WHERE cart_id=@cart_id AND purchased=@payment_id;
  `,
  SELECT_CUSTOMER_INFO: `
    SELECT [name], [address]
    FROM [dbo].[Customer]
    WHERE [customer_id] = @customer_id;
  `
};

/* ---------------------- JSON Serialization Helpers ---------------------- */

/**
 * Safely serialize array or JSON product data
 */
function serializeProducts(products) {
  if (!products) return "[]";
  if (typeof products === "string") {
    try {
      JSON.parse(products); // if already valid JSON
      return products;
    } catch {
      return JSON.stringify(products.split(",").map((p) => p.trim()));
    }
  }
  if (Array.isArray(products)) return JSON.stringify(products);
  return JSON.stringify([products]);
}

/**
 * Safely deserialize JSON product data
 */
function deserializeProducts(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [parsed];
  } catch {
    return raw.split(",").map((p) => p.trim());
  }
}

/* ---------------------- HELPER FUNCTIONS ---------------------- */

async function enrichPaymentData(paymentRow) {
  const pool = await poolPromise;

  const productRequest = pool
    .request()
    .input("cart_id", sql.VarChar(7), paymentRow.cart_id)
    .input("payment_id", sql.VarChar(10), paymentRow.payment_id);

  const customerRequest = pool
    .request()
    .input("customer_id", sql.VarChar(7), paymentRow.customer_id);

  const [productNamesResult, totalItemsResult, customerInfoResult] =
    await Promise.all([
      productRequest.query(QUERY.SELECT_PRODUCT_NAMES),
      productRequest.query(QUERY.SELECT_TOTAL_ITEMS),
      customerRequest.query(QUERY.SELECT_CUSTOMER_INFO)
    ]);

  const names = productNamesResult.recordset[0]?.names || "";
  const num = totalItemsResult.recordset[0]?.num || 0;
  const name = customerInfoResult.recordset[0]?.name || "";
  const address = customerInfoResult.recordset[0]?.address || "";

  // 🧠 Deserialize products from DB JSON
  const productList = deserializeProducts(paymentRow.product_ids);

  const enriched = Payment.fromDatabase({
    ...paymentRow,
    product_ids: productList,
    product_names: names,
    total_items: num,
    customer_name: name,
    address
  });

  return enriched;
}

/* ---------------------- MAIN FUNCTIONS ---------------------- */

async function getAllpaymentsSql() {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().query(QUERY.SELECT_ALL_ACTIVE);

    const enrichedPayments = [];
    for (const row of recordset) {
      const enriched = await enrichPaymentData(row);
      enrichedPayments.push(enriched);
    }

    return ApiResponse.success(
      enrichedPayments,
      "Payments retrieved successfully",
      enrichedPayments.length
    );
  } catch (error) {
    return ApiResponse.error("Failed to retrieve payments", error.message);
  }
}

async function createPaymentSql(
  payment_type,
  customer_id,
  cart_id,
  total_amount,
  products = []
) {
  try {
    const pool = await poolPromise;
    const payment_id = new ShortUniqueId({ length: 7 }).rnd();
    const date = new Date().toISOString().split("T")[0];

    if (isNaN(total_amount)) {
      return ApiResponse.error(
        `Invalid total_amount provided: ${total_amount}`
      );
    }

    // 🧩 Serialize product IDs as JSON before storing
    const serializedProducts = serializeProducts(products);

    const insertRequest = pool.request();
    insertRequest.input("payment_id", sql.VarChar(10), payment_id);
    insertRequest.input("payment_date", sql.Date, date);
    insertRequest.input("payment_type", sql.VarChar(20), payment_type);
    insertRequest.input("customer_id", sql.VarChar(7), customer_id);
    insertRequest.input("cart_id", sql.VarChar(7), cart_id);
    insertRequest.input(
      "product_ids",
      sql.NVarChar(sql.MAX),
      serializedProducts
    );
    insertRequest.input("total_amount", sql.Decimal(18, 2), total_amount);

    await insertRequest.query(QUERY.INSERT_PAYMENT);

    // ✅ Update purchase flag in Cart_item
    const updateRequest = pool.request();
    updateRequest.input("cart_id", sql.VarChar(7), cart_id);
    updateRequest.input("payment_id", sql.VarChar(10), payment_id);
    await updateRequest.query(QUERY.UPDATE_CART_ITEMS_PURCHASED);

    const payment = new Payment(
      payment_id,
      date,
      payment_type,
      customer_id,
      cart_id,
      products,
      total_amount
    );

    return ApiResponse.success(payment, "Payment created successfully");
  } catch (error) {
    return ApiResponse.error("Payment creation failed", error.message);
  }
}

async function getSinglePaymentSql(cart_id) {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("cart_id", sql.VarChar(7), cart_id);

    const { recordset } = await request.query(QUERY.SELECT_SINGLE_PAYMENT);

    if (recordset.length === 0) {
      return ApiResponse.error("Payment not found");
    }

    const enrichedPayment = await enrichPaymentData(recordset[0]);
    return ApiResponse.success(
      enrichedPayment,
      "Payment retrieved successfully"
    );
  } catch (error) {
    return ApiResponse.error("Failed to retrieve payment", error.message);
  }
}

/* ---------------------- EXPORTS ---------------------- */
module.exports = {
  getAllpaymentsSql,
  createPaymentSql,
  getSinglePaymentSql,
  serializeProducts,
  deserializeProducts
};
