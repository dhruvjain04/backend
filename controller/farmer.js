const { findByIdAndRemove } = require("../models/farmer");
const {validationResult}=require("express-validator");
const Product=module.require('../models/product.js');
const Farmer=module.require('../models/farmer.js');
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken');


/*module.exports.signup=(req,res,next)=>
{
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
         const Products=[];

         console.log(Password,Email,Password,City,Country,State,Name,Contact);

         bcrypt.hash(Password,12).then(hashedpass=>
            {
                const farmer=new Farmer({Email:Email,Password:hashedpass,City:City,Country:Country,State:State,Name:Name,
                Contact:Contact,Products:Products});

                return farmer.save();
            }).then(farmer=>
                {
                    res.status(200).json({message:"Farmer user created"});
                })
                . catch(err=>
                    {
                      
                        if(!err.statusCode)
                        {
                            err.statusCode=500;
                        }
                        next(err);
                    })
        
 
}*/

module.exports.signup=async (req,res,next)=>
{
    try
    {
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

       //  console.log(Password,Email,Password,City,Country,State,Name,Contact);

       if(Cpassword!==Password)
         {
            const err=new Error("Password not confirmed");
            err.statusCode=422;
            return next(err);
         }

        // console.log(Cpassword);

        const user=await Farmer.findOne({Email:Email});
        if(user)
        {
            const err=new Error("Registration failed as email already exists");
            err.statusCode=422;
            throw err;
        }

         const hashedpass=await bcrypt.hash(Password,12);
            
         const farmer=new Farmer({Email:Email,Password:hashedpass,City:City,Country:Country,State:State,Name:Name,
                Contact:Contact,Products:Products});

         farmer.save();
         
         res.status(200).json({message:"Farmer user created"});

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

module.exports.login= async (req,res,next)=>
{
    try
    {
    const email=req.body.email;
    const password=req.body.password;
    
    const farmer = await Farmer.findOne({Email:email})
       if(!farmer)
       {
           const err=new Error("A user with this email not found");
           err.statusCode=401;
           throw err;
       }
       const isEqual=await bcrypt.compare(password,farmer.Password);
    
       if(!isEqual)
            {
                const err=new Error("Wrong password");
                err.statusCode=401;
                throw err;
            }

            token=jwt.sign({
                email:farmer.Email,
                userId:farmer._id.toString()
            },'secretkey',{expiresIn:'6d'})

            console.log(token);

            //res.setHeader('Set-Cookie','token='+token);
            res.status(200).json({token:token,userId:farmer._id.toString()});

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



module.exports.home=async (req,res,next)=>
{
    try
    {
    const resData=await Product.find();
    
    console.log(resData);

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

module.exports.addproduct=async (req,res,next)=>
{
    try
    {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("validation failed , data incorrect");
        error.statusCode = 422;
        throw error;
    }
    const Crop_Name=req.body.name;
    const Description=req.body.description;
    const Contact=req.body.contactNumber;
   // const Country=req.body.Country;
   //const State=req.body.State;
   //const City=req.body.City;
    const Quantity=req.body.quantity;
    const Unit=req.body.unit;
    const Price_per_unit=req.body.pricePerUnit;
    const Location=req.body.location;
    const feedbacks=[];
    const ImageURL=req.file.filename;

   /* const product=new Product({Crop_Name:Crop_Name,Description:Description,Contact:Contact,Country:Country,
        State:State,City:City,Quantity:Quantity,Unit:Unit,Price_per_unit:Price_per_unit,Feedbacks:feedbacks,ImageURL:'images/'+ImageURL,
    Owner:req.userId});*/
    const product=new Product({Crop_Name:Crop_Name,Description:Description,Contact:Contact,Quantity:Quantity,Unit:Unit,Price_per_unit:Price_per_unit,Feedbacks:feedbacks,ImageURL:'images/'+ImageURL,
    Location:Location,Owner:req.userId});

    product.save();

    const farmer=await Farmer.findById(req.userId);
        
    farmer.Products.push(product);

    farmer.save();
            
    res.status(201).json({message:"Product created successfully",product:product});
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

module.exports.myaccount = async (req, res, next) => {
    try {
      const farmer = await Farmer.findById(req.userId);
  
      let products = [];
      for (const prod_id of farmer.Products) {
        const prod = await Product.findById(prod_id.toString());
        if (!prod) {
          const err = new Error('Could not find Product');
          err.statusCode = 420;
          throw err;
        }
        products.push(prod);
      }
  
      res.status(200).json({ products: products ,user:farmer});
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  

module.exports.viewproduct=async (req,res,next)=>
{
    try{
    const prod_id=req.params.prod_id;

    const prod = await Product.findById(prod_id);

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

module.exports.removeproduct=async (req,res,next)=>
{
    try{
    const prod_id=req.params.prod_id;
    const prod=await Product.findById(prod_id)
    
        if(!prod)
        {
            const error=new Error("Product not Found");
            error.statusCode=404;
            throw error;
        }
        //console.log(prod.Owner.toString(),req.userId);
        if(prod.Owner.toString()!==req.userId)
        {
            const error=new Error("Not authorized to remove the product");
            error.statusCode=403;
            throw error;
        }

        await Product.findByIdAndRemove(prod_id);

    
        const farmer=await Farmer.findById(req.userId);
        
        farmer.Products.pull(prod_id);

        farmer.save();
            
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
};