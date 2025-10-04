const db = require("../db/connect");
const ShortUniqueId = require('short-unique-id');



const getAllProductsSql = async (filterString) => {
    let sql = `select * from product ${filterString}`;
    const [allProducts, _] = await db.execute(sql);
    return allProducts;
};

const createProductSql = async (product_name,product_company,color,size,gender,cost,quantity,image) => {

    const uid = new ShortUniqueId({ length: 4});
    const product_id = uid.rnd();

    let sql = `insert into Product values('${product_id}','${product_name}','${product_company}','${color}',${size},'${gender}',${cost},${quantity},'${image}');`
    const [product,_]  = await db.query(sql);
    return {product,product_id }; 
}

const getSingleProductsSql = async (id) => {
    let sql = `select * from product where product_id = '${id}'`;
    const [Product, _] = await db.execute(sql);
    return Product;
};

const deleteProductSql = async (id) => {
    let sql = `delete  from product where product_id = '${id}'`;
    const [Product, _] = await db.execute(sql);
    return Product;
};

const updateProductSql = async (id,filterString) => {
    let sql = `UPDATE product
    SET ${filterString} WHERE product_id = '${id}' `;

    const result = await db.execute(sql);
    return result;
};



module.exports = { getAllProductsSql, createProductSql, getSingleProductsSql, deleteProductSql, updateProductSql }


