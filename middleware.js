const {restaurantSchema,reviewSchema}=require('./schemas.js');
const ExError=require('./helpers/exerror');
const Restaurant = require('./models/restaurant');
const Review=require('./models/review');
const User=require('./models/user');

/////////CHECK IF LOGGED IN
module.exports.isLoggedIn = (req, res, next) =>{
        if(!req.isAuthenticated()){
        req.session.returnTo= req.originalUrl
        req.flash('error','You must be signed in!')
        return res.redirect('/login');
    }
    next();
}


module.exports.validateRestaurant = (req, res, next) => {
    const {error} = restaurantSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExError(msg, 400)
    }else {
        next();
    }
    
}

///////RESTAURANT OWNERSHIP CHECK
module.exports.verifyAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const restaurant = await Restaurant.findById(id);
    if(restaurant.author.equals(req.user._id) || req.user.isAdmin){
        next();
    } else {
        req.flash('error', 'You must have a permission to do that!')
        return res.redirect(`/restaurants/${id}`);
    }
    
}

/////////REVIEW OWNERSHIP CHECK
module.exports.verifyReview = async(req, res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(review.author.equals(req.user._id) || req.user.isAdmin){
        next();
    } else {
        req.flash('error', 'You must have a permission to do that!')
        return res.redirect(`/restaurants/${id}`);
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExError(msg, 400)
    }else {
        next();
    }
}

module.exports.checkProfileOwnership =  (req, res, next) => {
    //if user is logged in
    if (req.isAuthenticated()) {
        User.findById(req.params.id, function (err, foundUser) {
            if (err || !foundUser) {
                req.flash('error', 'Something Went Wrong!');
                res.redirect('back');
            } else {
                 //if user is logged in, do they own the profile?
                if (foundUser.equals(req.user._id)) {
                    next();
                } else {
                    //otherwise redirect
                    req.flash('error', "You don't have permission to do that.");
                    res.redirect('back');
                };
            };
        });
    } else {
        //if not, redirect.
        req.flash('error', "You need to be logged in to do that.");
        res.redirect('back');
    };
 
};