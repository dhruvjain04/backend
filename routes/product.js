const express = module.require('express');
const router = express.Router();
const { body } = module.require('express-validator')
const productcontroller = require('../controller/product.js');


router.get('/feedbacks/:prodID',productcontroller.feedbacks);

router.get('/:prod_id',productcontroller.viewproduct);

module.exports=router;