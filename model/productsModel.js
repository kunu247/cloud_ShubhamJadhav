// File name: productsModel
// File name with extension: productsModel.js
// Full path: E:\cloud_ShubhamJadhav\model\productsModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");
const Product = require("./Product");
const ApiResponse = require("./ApiResponse");

async function getAllProductsSql(filter = "") {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .query(`SELECT * FROM Product WHERE isactive = 1 ${filter}`);

    const products = recordset.map((row) => Product.fromDatabase(row));
    return ApiResponse.success(
      products,
      "Products retrieved successfully",
      products.length
    );
  } catch (error) {
    return ApiResponse.error("Failed to retrieve products", error.message);
  }
}

async function createProductSql({
  product_name,
  product_company,
  color,
  size,
  gender,
  cost,
  quantity,
  image
}) {
  try {
    const pool = await poolPromise;
    const uid = new ShortUniqueId({ length: 6 });
    const product_id = uid.rnd();

    if (!product_name || !product_company || !cost || !quantity) {
      return ApiResponse.error("Missing required fields for product creation");
    }

    const query = `
      INSERT INTO Product (
        product_id, product_name, product_company, color, size, gender, cost, quantity, image
      )
      VALUES (
        @product_id, @product_name, @product_company, @color, @size, @gender, @cost, @quantity, @image
      )
    `;

    await pool
      .request()
      .input("product_id", sql.VarChar(10), product_id)
      .input("product_name", sql.NVarChar(50), product_name)
      .input("product_company", sql.NVarChar(50), product_company)
      .input("color", sql.NVarChar(20), color || null)
      .input("size", sql.Int, size || null)
      .input("gender", sql.Char(1), gender || "U")
      .input("cost", sql.Int, cost)
      .input("quantity", sql.Int, quantity)
      .input("image", sql.NVarChar(sql.MAX), image || null)
      .query(query);

    const product = new Product(
      product_id,
      product_name,
      product_company,
      color,
      size,
      gender,
      cost,
      quantity,
      image
    );

    return ApiResponse.success(product, "Product created successfully");
  } catch (error) {
    return ApiResponse.error("Product creation failed", error.message);
  }
}

async function getSingleProductsSql(id) {
  try {
    const pool = await poolPromise;
    const { recordset } = await pool
      .request()
      .input("id", sql.VarChar(10), id)
      .query("SELECT * FROM Product WHERE product_id = @id AND isactive = 1");

    if (recordset.length === 0) {
      return ApiResponse.error("Product not found");
    }

    const product = Product.fromDatabase(recordset[0]);
    return ApiResponse.success(product, "Product retrieved successfully");
  } catch (error) {
    return ApiResponse.error("Failed to retrieve product", error.message);
  }
}

async function deleteProductSql(id) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("id", sql.VarChar(10), id)
      .query("UPDATE Product SET isactive = 0 WHERE product_id = @id");

    return ApiResponse.success(
      { product_id: id },
      "Product deleted successfully"
    );
  } catch (error) {
    return ApiResponse.error("Product deletion failed", error.message);
  }
}

async function updateProductSql(id, updates) {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .query(`UPDATE Product SET ${updates} WHERE product_id = '${id}'`);

    const result = await getSingleProductsSql(id);
    return result.success
      ? ApiResponse.success(result.data, "Product updated successfully")
      : result;
  } catch (error) {
    return ApiResponse.error("Product update failed", error.message);
  }
}

module.exports = {
  getAllProductsSql,
  createProductSql,
  getSingleProductsSql,
  deleteProductSql,
  updateProductSql
};
