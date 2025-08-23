const express = require('express');
const router = express.Router();
const test = require('../controllers/test.js')
const login = require('../controllers/login.js');
const signup = require('../controllers/signup.js');
const wrapasync = require('../utils/wrapAsync.js');
const { userDetails } = require('../controllers/userDetails.js');
const authtoken = require('../middleware/authtoken.js');
const { getData } = require('../controllers/getData.js');
const { analyzeImage } = require('../controllers/visionController.js');
const IngredientInfo = require('../controllers/API/IngredientInfo.js');
const nutritionInfo = require('../controllers/API/nutritionInfo.js');
const logout = require('../controllers/logout.js');

router
    .route('/')
    .get(test);

router
    .route('/login')
    .post(wrapasync(login));    

router
    .route('/signup')
    .post(wrapasync(signup)); 

router
   .route('/logout')
   .post(authtoken,wrapasync(logout));    
    
router
   .route('/userdetails')
   .get(authtoken,wrapasync(userDetails))    

router  
   .route('/getdata')
   .post(authtoken, wrapasync(getData))   

router
   .route('/airesponseforing')
   .post(IngredientInfo)

router
   .route('/airesponsefornue')
   .post(nutritionInfo)   

module.exports = router;

//1. Import the express module and express.router
//2. create various router
//3. export the router