// File name: cartModel
// File name with extension: cartModel.js
// Full path: E:\cloud_ShubhamJadhav\model\cartModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const CartItem = require("./CartItem");
const ApiResponse = require("./ApiResponse");

async function getAllCartItemsSql() {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool.request().query(`
        SELECT
          ci.cart_id,
          ci.product_id,
          ci.cart_quantity,
          ci.date_added,
          ci.purchased,
          ci.created_on,
          ci.isactive,
          p.product_name,
          p.product_company,
          p.cost,
          p.image,
          p.color,
          p.size
        FROM Cart_item ci
        INNER JOIN Product p ON ci.product_id = p.product_id
        WHERE ci.isactive = 1;
      `);

    const cartItems = recordset.map((row) => CartItem.fromDatabase(row));
    return ApiResponse.success(
      cartItems,
      "Cart items retrieved successfully",
      cartItems.length
    );
  } catch (error) {
    return ApiResponse.error("Failed to retrieve cart items", error.message);
  }
}

async function createCartItemsSql(
  cart_quantity,
  cart_id,
  product_id,
  purchased = "NO"
) {
  try {
    const pool = await poolPromise;
    const date = new Date().toISOString().split("T")[0];

    await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .input("product_id", sql.VarChar(10), product_id)
      .input("cart_quantity", sql.Int, cart_quantity)
      .input("date_added", sql.Date, date)
      .input("purchased", sql.VarChar(10), purchased).query(`
        INSERT INTO Cart_item (cart_id, product_id, cart_quantity, date_added, purchased)
        VALUES (@cart_id, @product_id, @cart_quantity, @date_added, @purchased)
      `);

    const cartItem = new CartItem(
      cart_id,
      product_id,
      cart_quantity,
      date,
      purchased
    );
    return ApiResponse.success(cartItem, "Cart item created successfully");
  } catch (error) {
    return ApiResponse.error("Failed to create cart item", error.message);
  }
}

async function getSingleCartItemSql(cart_id) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id).query(`
        SELECT
          ci.cart_id,
          ci.product_id,
          ci.cart_quantity,
          ci.date_added,
          ci.purchased,
          ci.created_on,
          ci.isactive,
          p.product_name,
          p.product_company,
          p.cost,
          p.image,
          p.color,
          p.size
        FROM Cart_item ci 
        INNER JOIN Product p ON ci.product_id = p.product_id 
        WHERE ci.cart_id = @cart_id AND ci.isactive = 1 AND ci.purchased = 'NO'
      `);

    const cartItems = recordset.map((row) => CartItem.fromDatabase(row));
    return ApiResponse.success(
      cartItems,
      "Cart items retrieved successfully",
      cartItems.length
    );
  } catch (error) {
    return ApiResponse.error("Failed to retrieve cart items", error.message);
  }
}

async function updateCartSql(cart_id, cart_quantity, product_id) {
  try {
    const pool = await poolPromise;
    const { rowsAffected } = await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .input("product_id", sql.VarChar(10), product_id)
      .input("cart_quantity", sql.Int, cart_quantity).query(`
        UPDATE Cart_item 
        SET cart_quantity = @cart_quantity
        WHERE
          cart_id = @cart_id AND
          product_id = @product_id AND
          isactive = 1
      `);

    if (rowsAffected === 0) {
      return ApiResponse.error("Cart item not found");
    }

    return ApiResponse.success(
      { cart_id, product_id, cart_quantity },
      "Cart item updated successfully"
    );
  } catch (error) {
    return ApiResponse.error("Failed to update cart item", error.message);
  }
}

async function deleteCartItemSql(cart_id, product_id) {
  try {
    const pool = await poolPromise;
    const { rowsAffected } = await pool
      .request()
      .input("cart_id", sql.VarChar(7), cart_id)
      .input("product_id", sql.VarChar(10), product_id).query(`
        UPDATE Cart_item
        SET isactive = 0
        WHERE
          cart_id = @cart_id AND
          product_id = @product_id
      `);

    if (rowsAffected === 0) {
      return ApiResponse.error("Cart item not found");
    }

    return ApiResponse.success(
      {
        cart_id,
        product_id
      },
      "Cart item deleted successfully"
    );
  } catch (error) {
    return ApiResponse.error("Failed to delete cart item", error.message);
  }
}

module.exports = {
  getAllCartItemsSql,
  createCartItemsSql,
  getSingleCartItemSql,
  updateCartSql,
  deleteCartItemSql
};
