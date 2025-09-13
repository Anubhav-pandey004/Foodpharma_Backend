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
const rateLimit = require('../middleware/rateLimit.js');
const { getHealthProfile, updateHealthProfile } = require('../controllers/healthProfile');
const { createReport, listReports, getReport } = require('../controllers/reportController');

// Basic rate limiters for auth endpoints
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, key: 'login' });
const signupLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, key: 'signup' });
const reportCreateLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 30, key: 'report-create' });

router
    .route('/')
    .get(test);

router
    .route('/login')
    .post(loginLimiter, wrapasync(login));    

router
    .route('/signup')
    .post(signupLimiter, wrapasync(signup)); 

router
   .route('/logout')
   .post(authtoken,wrapasync(logout));    

// Health profile endpoints
router
  .route('/health-profile')
  .get(authtoken, wrapasync(getHealthProfile))
  .put(authtoken, wrapasync(updateHealthProfile));
    
// Reports endpoints
router
  .route('/reports')
  .get(authtoken, wrapasync(listReports))
  .post(authtoken, reportCreateLimiter, wrapasync(createReport));

router
  .route('/reports/:id')
  .get(authtoken, wrapasync(getReport));


router
   .route('/userdetails')
   .get(authtoken,wrapasync(userDetails))    

router  
   .route('/getdata')
   .post(authtoken, wrapasync(getData))   

router
   .route('/airesponseforing')
   .post(authtoken, wrapasync(IngredientInfo))

router
   .route('/airesponsefornue')
   .post(authtoken, wrapasync(nutritionInfo))

module.exports = router;

//1. Import the express module and express.router
//2. create various router
//3. export the router
