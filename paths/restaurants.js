const express = require('express');
const router = express.Router();
const restaurants = require('../controllers/restaurants');
const wrapAsync = require('../helpers/wrapAsync');
const Restaurant = require('../models/restaurant');
const {isLoggedIn, verifyAuthor,validateRestaurant}= require('../middleware')
const multer =require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/')
    .get(wrapAsync(restaurants.index))
    .post(isLoggedIn,upload.array('image'),validateRestaurant,wrapAsync(restaurants.createRestaurant))

router.get('/new',isLoggedIn, restaurants.AddNewForm)


router.route('/:id')
    .get(wrapAsync(restaurants.restaurantInfo))
    .put(isLoggedIn,verifyAuthor,upload.array('image'),validateRestaurant, wrapAsync(restaurants.updateRestaurant))
    .delete(isLoggedIn,verifyAuthor ,wrapAsync(restaurants.deleteRestaurant))


router.get('/:id/edit',isLoggedIn, verifyAuthor, wrapAsync(restaurants.editForm))



module.exports = router;

