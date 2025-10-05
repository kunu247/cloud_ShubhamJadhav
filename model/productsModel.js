// File name: productsModel
// File name with extension: productsModel.js
// Full path: E:\cloud_ShubhamJadhav\model\productsModel.js
// Directory: E:\cloud_ShubhamJadhav\model

const { sql, poolPromise } = require("../db/connect");
const ShortUniqueId = require("short-unique-id");

async function getAllProductsSql(filter = "") {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .query(`SELECT * FROM Product ${filter}`);
  return recordset;
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
  const pool = await poolPromise;
  const uid = new ShortUniqueId({ length: 6 });
  const product_id = uid.rnd();

  // Validate inputs
  if (!product_name || !product_company || !cost || !quantity) {
    throw new Error("Missing required fields for product creation.");
  }

  // SQL Insert with strict parameterization
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

  return {
    success: true,
    product_id,
    message: "Product created successfully."
  };
}

async function getSingleProductsSql(id) {
  const pool = await poolPromise;
  const { recordset } = await pool
    .request()
    .input("id", sql.VarChar(10), id)
    .query("SELECT * FROM Product WHERE product_id = @id");
  return recordset;
}

async function deleteProductSql(id) {
  const pool = await poolPromise;
  await pool
    .request()
    .input("id", sql.VarChar(10), id)
    .query("DELETE FROM Product WHERE product_id = @id");
  return { deleted: true, product_id: id };
}

async function updateProductSql(id, updates) {
  const pool = await poolPromise;
  await pool
    .request()
    .query(`UPDATE Product SET ${updates} WHERE product_id = '${id}'`);
  return { updated: true, product_id: id };
}

module.exports = {
  getAllProductsSql,
  createProductSql,
  getSingleProductsSql,
  deleteProductSql,
  updateProductSql
};
