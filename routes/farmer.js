const express = module.require('express');
const router = express.Router();
const { body } = module.require('express-validator')
const farmercontroller = require('../controller/farmer.js');
const multer = module.require('multer');
const path = module.require('path');
const isAuth=module.require("../middleware/is-Auth.js");
const Farmer=module.require('../models/farmer.js');
const axios =module.require('axios');
const cheerio =module.require('cheerio');
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

const imagesPath = path.join(__dirname, "..", 'images');

console.log(imagesPath);

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,imagesPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
   if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg'  || file.mimetype === 'image/jpeg') {
        cb(null, true);
   }

   else {
       cb(null, false);
    }
}
const upload = multer({storage:fileStorage,dest: imagesPath});


router.put('/farmerSignup',[
    body('email').isEmail().withMessage("Enter valid email address").
    custom((value,{req})=>{
         return Farmer.findOne({email:value}).then(record=>
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
    
],farmercontroller.signup);

router.post('/FarmerLogin',farmercontroller.login);

router.post('/add-product',upload.single('image'),isAuth,farmercontroller.addproduct);

router.get('/home',isAuth,farmercontroller.home);

router.get('/product/:prod_id',isAuth,farmercontroller.viewproduct);

router.delete('/product/:prod_id',isAuth,farmercontroller.removeproduct);

router.get('/myaccount',isAuth,farmercontroller.myaccount);

router.get('/scrape', async (req, res) => {
  //  const targetUrl = 'https://www.thehindubusinessline.com/economy/agri-business/'; // Get the target URL from query parameters
  
  let titles=[];
  let srcValues=[];
  let sources=[];
  let Object=[];

    try {
        const response = await axios.get(
          'https://www.livemint.com/industry/agriculture',
        ) // Replace with your target URL
        const $ = cheerio.load(response.data)

          titles = $('h2.headline > a') // Using descendant selector
          .map((index, element) => $(element).text())
          .get()
       /* const img_srcs = $('div.thumbnail img').attr('src')
        .map((index, element) => $(element).text())
        .get();*/
        //const srcValues = [];
$('div.thumbnail img').each((index, element) => {
  const src = $(element).attr('src');
  srcValues.push(src);
});

//const sources = [];
$('h2.headline a').each((index, element) => {
  const src = $(element).attr('href');
  sources.push('http://www.livemint.com/'+src);
});
       
       // console.log(titles,srcValues,sources);
       
      } catch (error) {
        console.error('Error:', error)
      }
      let n=titles.length;
      for(let i=0 ; i<n; i++)
      {
          Object.push({title:titles[i].split('\n')[1],img_src:srcValues[i],source:sources[i]});
      }
      //res.json({titles:titles,img_sources:srcValues,sources:sources});
      console.log(Object);
      res.json({news:Object});
  });


  /*router.get('/weather_hourly', async(req,res,next)=>
  {
    /*const options = {
      //method: 'GET',
      url: 'https://ai-weather-by-meteosource.p.rapidapi.com/hourly',
      params: {
        place_id: 'pune',
        timezone: 'auto',
        language: 'en',
        units: 'auto'
      },
      headers: {
        'X-RapidAPI-Key': 'f2ffd78139mshb9d1ae88a54cbc8p1706e6jsn3e5a3020db5b',
        'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
      }
    };*/
   /* const API_URL = 'https://ai-weather-by-meteosource.p.rapidapi.com/hourly?place_id=pune&timezone=auto&language=en&units=auto';
    const API_KEY = 'f2ffd78139mshb9d1ae88a54cbc8p1706e6jsn3e5a3020db5b';
    try{
      const response=await axios.get(API_URL,
        {
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com',
          },
        });
      console.log(response.data);
      res.json({response:response});
    }
    catch(error){
   console.log(error);
    }
  })*/


module.exports = router;