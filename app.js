const express = module.require('express');
const app = express();
const bodyParser = module.require('body-parser');
const userroutes = module.require('./routes/user.js');
const farmerroutes = module.require('./routes/farmer.js');
const productroutes = module.require('./routes/product.js');
const mongoose = module.require('mongoose');
const multer = module.require('multer');
const path = module.require('path');
// const imagesPath = path.join(__dirname, 'images');

// const upload = multer({ dest: imagesPath });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/user', userroutes);
app.use('/farmer',farmerroutes);
app.use('/product',productroutes);

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const data=err.data;
    res.status(status).json({ message: message ,data:data});
})

mongoose.connect('mongodb+srv://dhruvjain6467:beproject@cluster0.bcqxztg.mongodb.net/portal_farmer?retryWrites=true&w=majority').
    then(resData => { app.listen(8002); console.log('mongoose is connected') }).catch(err => { console.log(err) })
