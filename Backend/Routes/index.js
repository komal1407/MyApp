// need the router from the express
const express = require('express');
const router = express.Router();


// import the controllers
const locationController = require('../Controllers/Locations');
const restaurantController = require('../Controllers/Restaurants');
const mealtypesController = require('../Controllers/Mealtypes');
const userController = require('../Controllers/User');
const paymentController = require('../Controllers/Payment');
const menuController = require('../Controllers/Menu');


// declare the routes
router.get('/getAllLocations', locationController.getAllLocations);
router.get('/getAllRestaurants', restaurantController.getAllRestaurants);
router.get('/getRestaurantsByLocation/:cityName', restaurantController.getRestaurantsByLocation);
router.get('/getRestaurantById/:restaurantId', restaurantController.getRestaurantsById);
router.post('/filterRestaurants', restaurantController.filterRestaurants);
router.get('/getMealTypes', mealtypesController.getAllMealtypes);
router.post('/payment', paymentController.payment);
router.post('/paymentCallback', paymentController.paymentCallback);
router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.get('/getMenuByRestaurant/:restaurantId', menuController.getMenuForRestaurant);



// export the router
module.exports = router;