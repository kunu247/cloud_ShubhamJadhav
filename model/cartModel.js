const db = require("../db/connect");
const ShortUniqueId = require('short-unique-id');


const getAllCartItemsSql = async () => {
    const sql = `select * from cart_item`
    const [cart,_] = await db.execute(sql);
    return cart;
}

const createCartItemsSql = async (cart_quantity,cart_id,product_id,purchased) => {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    let createdAtDate = `${yyyy}-${mm}-${dd}`
    const sql = `insert into cart_item values(${cart_quantity},'${createdAtDate}','${cart_id}','${product_id}','${purchased}')`
    const [cart,_] = await db.execute(sql);
    return cart;
}

const getSingleCartItemSql = async (cart_id) => {
    const sql = `select  p.product_name,p.product_company,c.cart_quantity,p.cost,p.image,p.color,c.product_id,cart_id 
    from product p,cart_item c 
    where p.product_id = c.product_id and c.cart_id = "${cart_id}" and c.purchased= "no"`
    const [cart,_] = await db.execute(sql);
    return cart;
}
// const getSingleCartItemSql = async (cart_id) => {
//     const sql = `select * from cart_item where cart_id ='${cart_id}'`
//     const [cart,_] = await db.execute(sql);
//     return cart;
// }

const updateCartSql = async (id,cart_quantity,product_id) => {
    let sql = `UPDATE cart_item
    SET cart_quantity = ${cart_quantity} WHERE product_id = '${product_id}' and cart_id ='${id}'`;
    const result = await db.execute(sql);
    return result;
};


const deleteCartItemSql = async (id,product_id) => {
    let sql = `delete  from cart_item where product_id = '${product_id}' and cart_id = '${id}'`;
    const [Product, _] = await db.execute(sql);
    return Product;
};


module.exports = {
    getAllCartItemsSql,
    createCartItemsSql,
    getSingleCartItemSql,
    updateCartSql,
    deleteCartItemSql
}