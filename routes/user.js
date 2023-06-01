const express = module.require('express');
const router = express.Router();
const { body } = module.require('express-validator')
const usercontroller = require('../controller/user.js');
const multer = module.require('multer');
const path = module.require('path');
const isAuth=module.require("../middleware/is-Auth.js");
const User=module.require('../models/user.js');
/*
const path = module.require('path');
const imagesPath = path.join(__dirname, "..", 'images');

console.log(imagesPath);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imagesPath)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
})

const upload = multer({ storage, dest: imagesPath });*/


router.put('/exporterSignup',[
    body('email').isEmail().withMessage("Enter valid email address").
    custom((value,{req})=>{
         return User.findOne({email:value}).then(record=>
            {
                if(record)
                {
                    return Promise.reject('Email already exists');
                }
            })
    }).normalizeEmail(),
    body('name').not().isEmpty(),
    body('contact').isNumeric().isLength({min:10,max:10}).not().isEmpty(),
    body('state').not().isEmpty(),
    body('city').not().isEmpty(),
    body('country').not().isEmpty(),
    body('cpassword').not().isEmpty()
    
],usercontroller.signup);

router.post('/exporterLogin',usercontroller.login);

router.get('/addproduct/:prod_id',isAuth,usercontroller.addproduct);

//router.get('/product/:prod_id',isAuth,usercontroller.viewproduct);

router.get('/products_display',isAuth,usercontroller.allproducts);

router.get('/products/:category',isAuth,usercontroller.category_products);

router.get('/myaccount',isAuth,usercontroller.myaccount);

router.delete('/product/:prod_id',isAuth,usercontroller.removeproduct);

router.post('/product/feedback/:prod_id',isAuth,usercontroller.feedback);



module.exports = router;