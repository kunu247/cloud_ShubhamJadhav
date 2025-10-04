const { getAllCartItemsSql, createCartItemsSql, getSingleCartItemSql, updateCartSql, deleteCartItemSql } = require("../model/cartModel");
const db = require("../db/connect");



const getAllCartItems = async (req,res) => {
    try {
        const cart = await getAllCartItemsSql();
        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(404).send({msg : error});
    }
}

const createCartItems = async (req,res) => {
    try {
        const { cart_quantity,cart_id,product_id,purchased } =  req.body;
        const cart = await createCartItemsSql(cart_quantity,cart_id,product_id,purchased);
        res.status(201).send({msg : cart,cart : {cart_quantity,cart_id,product_id,purchased}});
        // res.status(201).send(cart);
    } catch (error) {
        console.log(error);
        res.status(404).send({msg : error,});
    }
}

const getSingleCart = async (req,res) => {
    try {
        const {id} = req.params;
        const cart = await getSingleCartItemSql(id);
        res.send(cart);
    } catch (error) {
        console.log(error);
        res.status(404).send({msg : error});
    }
}

const updateCart = async (req,res) => {
    try {
        const {id} = req.params;
        const {cart_quantity,product_id} = req.body;

        let sql = `SELECT * FROM cart_item  WHERE product_id = '${product_id}' and cart_id ='${id}'`
        const [cartItemExists,_] = await db.execute(sql);
        if(cartItemExists.length === 0){
            return res.status(404).send({
                status : 404,
                msg : `cart with cart_id = ${id} and product_id = ${product_id} not found`
            })
        }

        const cart = await updateCartSql(id,cart_quantity,product_id);
        res.send({cart: cartItemExists});
    } catch (error) {
        console.log(error);
        res.status(404).send({msg : error});
    }
}

const deleteCartItem = async (req,res) => {
    try {
        const {id} = req.params;
        const {product_id} = req.body;
        let sql = `SELECT * FROM cart_item  WHERE product_id = '${product_id}' and cart_id ='${id}';`
        const [cartItemExists,_] = await db.execute(sql);
        if(cartItemExists.length === 0){
            return res.status(404).send({
                status : 400,
                msg : `cart with cart_id = ${id} and product_id = ${product_id} not found`
            })
        }
        const cart = await deleteCartItemSql(id,product_id);
        res.send({msg : `cart item with cart_id = ${id} and product_id = ${product_id} deleted`,cart : cartItemExists});
    } catch (error) {
        console.log(error);
        res.status(400).send({msg : error});
    }
}





module.exports = {
    getAllCartItems,
    createCartItems,
    getSingleCart,
    updateCart,
    deleteCartItem
}