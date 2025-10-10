// File name: cartModel
// File name with extension: cartModel.js
// Full path: E:\cloud_ShubhamJadhav\model\cartModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");

/**
 * 🧩 Fetch all cart items (for admin/debug)
 */
async function getAllCartItemsSql() {
  const pool = await poolPromise;
  const { recordset } = await pool.request().query(`
    SELECT 
      c.cart_id AS cart_id,
      c.product_id AS product_id,
      c.cart_quantity AS cart_quantity,
      c.date_added AS date_added,
      c.purchased AS purchased,
      c.created_on AS created_on,
      c.isactive AS isactive,
      p.product_name AS product_name,
      p.product_company AS product_company,
      p.cost AS cost,
      p.image AS image,
      p.color AS color,
      p.size AS size
    FROM Cart_item c
    LEFT JOIN Product p ON p.product_id = c.product_id
  `);
  return recordset;
}

/**
 * 🧠 Fetch all products in a single user's cart (joined with product info)
 */
async function getSingleCartItemSql(cart_id) {
  const pool = await poolPromise;

  const query = `
    SELECT 
      c.cart_id AS cart_id,
      c.product_id AS product_id,
      c.cart_quantity AS cart_quantity,
      c.date_added AS date_added,
      c.purchased AS purchased,
      c.created_on AS created_on,
      c.isactive AS isactive,
      p.product_name AS product_name,
      p.product_company AS product_company,
      p.cost AS cost,
      p.image AS image,
      p.color AS color,
      p.size AS size
    FROM Cart_item c
    INNER JOIN Product p ON p.product_id = c.product_id
    WHERE c.cart_id = @cart_id AND c.purchased = 'NO'
  `;

  const { recordset } = await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .query(query);

  return recordset || [];
}

async function createCartItemsSql(
  cart_quantity,
  cart_id,
  product_id,
  purchased = "NO"
) {
  const pool = await poolPromise;
  const date = new Date().toISOString().split("T")[0];

  await pool
    .request()
    .input("cart_quantity", sql.Int, cart_quantity)
    .input("date_added", sql.Date, date)
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("product_id", sql.VarChar(10), product_id)
    .input("purchased", sql.VarChar(10), purchased).query(`
      INSERT INTO Cart_item (cart_quantity, date_added, cart_id, product_id, purchased)
      VALUES (@cart_quantity, @date_added, @cart_id, @product_id, @purchased)
    `);

  return { cart_quantity, cart_id, product_id, purchased };
}

async function updateCartSql(cart_id, cart_quantity, product_id) {
  const pool = await poolPromise;
  const { rowsAffected } = await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("cart_quantity", sql.Int, cart_quantity)
    .input("product_id", sql.VarChar(10), product_id)
    .query(
      "UPDATE Cart_item SET cart_quantity = @cart_quantity WHERE cart_id = @cart_id AND product_id = @product_id"
    );
  return rowsAffected;
}

async function deleteCartItemSql(cart_id, product_id) {
  const pool = await poolPromise;
  const { rowsAffected } = await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .input("product_id", sql.VarChar(10), product_id)
    .query(
      "DELETE FROM Cart_item WHERE cart_id = @cart_id AND product_id = @product_id"
    );
  return rowsAffected;
}

/*
 * createCartSql(cartIdOverride?)
 * Creates a new cart row and returns the cart_id.
 * If cartIdOverride is provided it will try to insert it; otherwise a unique id is generated.
 * Retries a few times on collision.
 /
async function createCartSql(cartIdOverride) {
  const pool = await poolPromise;
  const uid = new ShortUniqueId({ length: 7 });
  const maxAttempts = 6;
  let attempt = 0;

  while (attempt < maxAttempts) {
    const cart_id = cartIdOverride || uid.rnd(); // either override or generate
    try {
      // Parameterized insert with existence check to avoid constraint exceptions
      await pool.request().input("cart_id", sql.VarChar(7), cart_id).query(`
          IF NOT EXISTS (SELECT 1 FROM Cart WHERE cart_id = @cart_id)
            INSERT INTO Cart (cart_id) VALUES (@cart_id);
        `);

      // Confirm insertion
      const { recordset } = await pool
        .request()
        .input("cart_id", sql.VarChar(7), cart_id)
        .query("SELECT cart_id FROM Cart WHERE cart_id = @cart_id");

      if (recordset && recordset.length) {
        return cart_id;
      }

      // If not inserted, loop to try again
      attempt++;
      cartIdOverride = null; // force generation next try
    } catch (err) {
      // If unique constraint / primary key error, retry with a new id
      if (/unique|primary|violation/i.test(err.message)) {
        attempt++;
        cartIdOverride = null;
        continue;
      }
      // Unhandled error -> rethrow
      throw err;
    }
  }

  throw new Error("Unable to generate unique cart_id after multiple attempts.");
}

/
 * getCartByIdSql(cart_id)
 * Returns cart row if exists.
 /
async function getCartByIdSql(cart_id) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("cart_id", sql.VarChar(7), cart_id)
    .query("SELECT * FROM Cart WHERE cart_id = @cart_id");
  return recordset;
}
*/

module.exports = {
  getAllCartItemsSql,
  createCartItemsSql,
  getSingleCartItemSql,
  updateCartSql,
  deleteCartItemSql
  /*createCartSql,
  getCartByIdSql, */
};
