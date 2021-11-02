const express = require('express');
const router = express.Router({mergeParams:true});
const {validateReview, isLoggedIn, verifyReview} = require('../middleware')
const wrapAsync = require('../helpers/wrapAsync');
const ExError = require('../helpers/ExError');
const Restaurant = require('../models/restaurant');
const Review= require('../models/review');
const reviews = require('../controllers/reviews');


router.post('/',isLoggedIn, validateReview , wrapAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn,verifyReview, wrapAsync(reviews.deleteReview))

module.exports = router;