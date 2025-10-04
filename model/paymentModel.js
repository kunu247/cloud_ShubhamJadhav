const db = require("../db/connect");
const ShortUniqueId = require('short-unique-id');



const getAllpaymentsSql = async () => {

    
    const sql = `select * from payment `;
    const [payment,_] = await db.execute(sql);

    let newArray = []
    const paymentsArray = payment.map(async (singlePayment)=>{
        const sql1 = `(select group_concat(product_name) as names
        from product  
        where product_id 
        in(
             select product_id
             from cart_item c, payment p
             where c.cart_id = "${singlePayment.cart_id}" 
             and p.payment_id =  "${singlePayment.payment_id}"
             and c.purchased =  "${singlePayment.payment_id}" ))`

        const [[xyz]] = await db.execute(sql1);

        const sql2 = `select sum(cart_quantity) as num from cart_item where cart_id = "${singlePayment.cart_id}" and purchased = "${singlePayment.payment_id}"; `
        const [[{num}]] = await db.execute(sql2);
        const sql3 = `select name,address from customer where customer_id = "${singlePayment.customer_id}"`
        const [[cust]] = await db.execute(sql3);
        singlePayment.names = xyz.names;
        singlePayment.num = num;
        singlePayment.name = cust.name;
        singlePayment.address = cust.address;
         newArray.push(singlePayment)
        
        return singlePayment

    })
    try {
        const results = await Promise.all(paymentsArray);
        console.log("Result",results);
        
    } catch (error) {
        console.log(error);
    }
    return newArray


}

const createPaymentSql = async (payment_type,customer_id,cart_id,product_id,total_amount) => {
    let d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth() + 1;
    let dd = d.getDate();

    const uid = new ShortUniqueId({ length: 7});
    const payment_id = uid.rnd();

    let createdAtDate = `${yyyy}-${mm}-${dd}`
    // Total Amount 
    // const amountSql = `select  sum(cost) as total from product where product_id in 
    // ( select product_id from cart_item
    // where cart_id = "${cart_id}" and purchased = "no" );`
    // const [[{total}]] = await db.execute(amountSql);
    // if(!total){
    //      return {error : {status : 404, msg : "No Item In cart"}};
    // }

    const sql = `insert into payment values('${payment_id}','${createdAtDate}','${payment_type}','${customer_id}','${cart_id}','${total_amount}')`
    const [payment,_] = await db.execute(sql);

    let purchasedSql = `UPDATE cart_item
    SET purchased = "${payment_id}"
    WHERE  cart_id ='${cart_id}' and product_id in (${product_id});`
    const updatePurchased = await db.execute(purchasedSql);

    return {payment,obj : {payment_id,payment_date : createdAtDate,payment_type,customer_id,cart_id,total_amount },updatePurchased};
}

const getSinglePaymentSql = async (cart_id) => {

    const sql = `select * from payment where cart_id = "${cart_id}"`;
    const [payment,_] = await db.execute(sql);

    let newArray = []
    const paymentsArray = payment.map(async (singlePayment)=>{
        const sql1 = `(select group_concat(product_name) as names
        from product  
        where product_id 
        in(
             select product_id
             from cart_item c, payment p
             where c.cart_id = "${cart_id}" 
             and p.payment_id =  "${singlePayment.payment_id}"
             and c.purchased =  "${singlePayment.payment_id}" ))`

        const [[xyz]] = await db.execute(sql1);
        const sql2 = `select sum(cart_quantity) as num from cart_item where cart_id = "${cart_id}" and purchased = "${singlePayment.payment_id}"; `
        const [[{num}]] = await db.execute(sql2);
        singlePayment.names = xyz.names;
        singlePayment.num = num;
         newArray.push(singlePayment)
        
        return singlePayment

    })
    try {
        const results = await Promise.all(paymentsArray);
        // console.log("Result",results);
        
    } catch (error) {
        
    }
    return newArray
}

module.exports = {
    getAllpaymentsSql,
    createPaymentSql,
    getSinglePaymentSql
}