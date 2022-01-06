const Restaurant = require('../models/restaurant');
const Review= require('../models/review');

module.exports.addReview=async(req, res) => {
    const restaurant = await Restaurant.findById(req.params.id);
    const review = new Review(req.body.review);
    const reviews= await Review.find().where('restaurant').equals(restaurant._id);
    let average = 0;
    reviews.forEach ( async rev => {
        average += rev.rating;
      });
    average += review.rating;
    average = average / (reviews.length + 1);
    review.restaurant=restaurant;
    review.author=req.user._id;
    restaurant.averageRating = average;
    restaurant.reviews.push(review);
    await review.save();
    await restaurant.save();
    req.flash('success', 'You successfully added a new review!')
    res.redirect(`/restaurants/${restaurant._id}`);
}


module.exports.deleteReview = async (req, res ,) => {
    const { id, reviewId} = req.params;
    await Restaurant.findByIdAndUpdate(id, {$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'You deleted a review!')
    res.redirect(`/restaurants/${id}`);
}