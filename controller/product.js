const {validationResult}=require("express-validator");
const Product=module.require('../models/product.js');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');

module.exports.feedbacks=async (req,res,next)=>
{
   // console.log('hello');
    const id=req.params.prodID;
    const product=await Product.findById(id);
    //console.log('feedbacks');
    console.log(product.Feedbacks);
    res.status(200).json({feedbacks:product.Feedbacks});
}

module.exports.viewproduct=async (req,res,next)=>
{
    try
    {
    const prod_id=req.params.prod_id;
    const prod=await Product.findById(prod_id);
    console.log(prod);
    res.status(200).json({message:"Product fetched successfully",product:prod});
    }
    
    catch(err)
        {
           
            if (!err.statusCode) 
            {
                err.statusCode = 500;
            }
            next(err);
        }

}