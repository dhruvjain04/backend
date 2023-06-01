const User=module.require("../models/user.js");
const Product=module.require("../models/product.js");
const { validationResult } = module.require('express-validator');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')


module.exports.signup=async (req,res,next)=>         //sign up
{
    try{
    const errors=validationResult(req);

    if(!errors.isEmpty())
    {
        const err=new Error("validation failed");
        console.log(errors.array());
        err.statusCode=422;
        throw err;
    }

         const Email=req.body.email;
         const Password=req.body.password;
         const City=req.body.city;
         const Country=req.body.country;
         const State=req.body.state;
         const Name=req.body.name;
         const Contact=req.body.contact;
         const Cpassword=req.body.cpassword;
         const Products=[];

        const hashedpass=await bcrypt.hash(Password,12);

        if(Cpassword!==Password)
        {
           const err=new Error("Password not confirmed");
           err.statusCode=422;
           return next(err);
        }

        const user=new User({Email:Email,Password:hashedpass,City:City,Country:Country,State:State,Name:Name,
        Contact:Contact,Products:Products});
        user.save();
        res.status(200).json({message:"User created"});
         }

        catch(err)
                {
                    
                    if(!err.statusCode)
                        {
                            err.statusCode=500;
                        }
                        next(err);
                }
                    
   
}

module.exports.login=async (req,res,next)=>
{
    try{
    const email=req.body.email;
    const password=req.body.password;
   
    const user=await User.findOne({Email:email})
    if(!user)
       {
           const err=new Error("A user with this email not found");
           err.statusCode=401;
           throw err;
       }
     
       const isEqual = await bcrypt.compare(password,user.Password);
       if(!isEqual)
            {
                const err=new Error("Wrong password");
                err.statusCode=401;
                throw err;
            }

            token=jwt.sign({
                email:user.Email,
                userId:user._id.toString()
            },'secretkey',{expiresIn:'6d'})

            res.status(200).json({token:token,userId:user._id.toString()});

    }
        catch(err)
            {
                if(!err.statusCode)
                {
                   err.statusCode=500;
                }
                next(err);
            }
}

module.exports.allproducts=async (req,res,next)=>
{
    try
    {
    const resData=await Product.find();
    
   // console.log(resData);

    res.json({products:resData,message:"Products Fetched Successfully"});
    }
    
    catch(err)
    {
        if(!err.statusCode)
        {
            err.statusCode=500;
        }
        next(err);
    }
}

module.exports.category_products=async (req,res,next)=>
{
    try
    {
     
     const category=req.params.category;

     if(category==="ALL")
     {
          const products =await Product.find();
          console.log(products);
          res.json({products:products,message:"All products fetched successfully"});
     }
     else
     {

         const products=await Product.find({Crop_Name:category});
         console.log(products);
         res.json({products:products,message:"All products fetched successfully"});

      }
        
    }
    catch(err)
        {
                if(!err.statusCode)
                {
                    err.statusCode=500;
                }
                next(err);
        }
}


module.exports.myaccount= async(req,res,next)=>
{
    try
    {
    let products_data=[];

    const user=await User.findById(req.userId);

   // console.log(user.Products.length);
    if(user.Products.length!==0)
    {
       
    for(const prod_id of user.Products)
        {
            const prod=await Product.findById(prod_id.toString());
            if(!prod)
            {
                user.Products.pull(prod_id);
                user.save();
            }
            else products_data.push(prod);
        }
    }

        res.status(200).json({ products: products_data,user:user });
    }
    catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    
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

module.exports.addproduct=async (req,res,next)=>
{
    try
    {
    const prod_id=req.params.prod_id;
    
    const product=await Product.findById(prod_id)

    const user=await User.findById(req.userId);

    user.Products.push(product);

    user.save();

    res.status(200).json({message:"product added successfully"});

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

module.exports.removeproduct=async (req,res,next)=>
{
    try
    {
    const prod_id=req.params.prod_id;

    const prod=await Product.findById(prod_id)
    
        if(!prod)
        {
            const error=new Error("Product not Found");
            error.statusCode=404;
            throw error;
        }

    const user=await User.findById(req.userId);

    user.Products.pull(prod_id);

    user.save();
            
    
    res.status(200).json({message:"Product removed successfully"});

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

module.exports.feedback=async (req,res,next)=>
{
    const prod_id=req.params.prod_id;
    const product=await Product.findById(prod_id);
    const feedback=req.body.feedback;
    product.Feedbacks.push(feedback);
    product.save();
    res.json({message:"Feedback Posted",feedback:feedback});
}