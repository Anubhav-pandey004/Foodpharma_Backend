const express = require('express');
const router = express.Router();
const test = require('../controllers/test.js')
const login = require('../controllers/login.js');
const signup = require('../controllers/signup.js');
const wrapasync = require('../utils/wrapAsync.js');
const { userDetails } = require('../controllers/userDetails.js');
const authtoken = require('../middleware/authtoken.js');
const { getData } = require('../controllers/getData.js');

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
   .route('/userdetails')
   .get(authtoken,wrapasync(userDetails))    

router  
   .route('/getdata')
   .post(authtoken, wrapasync(getData))   

module.exports = router;

//1. Import the express module and express.router
//2. create various router
//3. export the router