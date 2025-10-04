const path = require('path');



const uploadProductImage = async (req,res) => {
    if(!req.files){
       return res.status(400).send({image : {msg : 'Please Upload Image',src : ""}})
        // throw new Error("Upload File");
    }
    let productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        // throw new Error('Please Upload Image');
      return  res.status(400).send({image : {msg : 'Please Upload Image',src : ""}})
    }
    const maxSize = 1024 * 1024
    if(productImage.size >  maxSize){
      return  res.status(400).send({image : {msg : 'Please Upload Image Smaller Than 1MB',src : ""}})
        // throw new Error('Please Upload Image Smaller than 1MB');
    }

    const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`);
    await productImage.mv(imagePath)
    return res.status(201).json({image : {src : `http://localhost:3000/uploads/${productImage.name}`}})
}




module.exports = {uploadProductImage}