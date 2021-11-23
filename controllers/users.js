const User = require('../models/user');
const {cloudinary} = require("../cloudinary"); 
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { each } = require('jquery');
const restaurant = require('../models/restaurant');


module.exports.showRegister= (req, res) => {
    return res.render('users/register');
}

module.exports.userRegistration = async(req, res,next ) => {
    try {
    const {email, username, password, firstName, lastName, avatar} = req.body;
    const user= new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        avatar: req.file.path,
        email:req.body.email,
    });
    if(req.body.adminCode === 'admincode123'){
        user.isAdmin = true;
    }
    const registeredUser= await User.register(user, password);
    req.login(registeredUser,err => {
        if(err) return next(err),
         req.flash('success',"You successfully registered! Welcome to Fine-Eats " + req.body.username);
    	 return res.redirect('/restaurants');
    })
    } catch(e){
        req.flash('error',e.message);
        return res.redirect('register');
    }
    
}

module.exports.showLogin = (req, res) => {
    res.render('users/login')
}

module.exports.Login = (req, res) => {
    req.flash('success', 'WELCOME BACK!');
    const redirectUrl= req.session.returnTo || '/restaurants';
    delete req.session.returnTo;
     res.redirect(redirectUrl);

}


module.exports.manage = async(req, res) => {
    const users = await User.find({});  
    res.render('users/usermanagment', {users: users});
}


module.exports.toggleAdmin = async (req,res) => {
    const id = req.body.id;
    if (id == req.user.id) {
        req.flash('error', 'you cannot make action on yourself!');
        return res.redirect('back');
    }
    let user = await User.findById(id);
    console.log(user);
    user.isAdmin =!user.isAdmin;
    await user.save(); 
    return res.redirect('back');
}


module.exports.deleteUser = async (req,res) => {
    const id = req.body.id;
    if (id == req.user.id) {
        req.flash('error', 'you cannot delete yourself!');
        return res.redirect('back');
    }
    let restaurants= await Restaurant.find().where('author').equals(id);
    restaurants.forEach ( async restaurant => {
        restaurant.author= req.user;
        await restaurant.save();
      });
    await User.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a User');
    return res.redirect('back')
}


module.exports.showProfile= async(req, res) => {
    User.findById(req.params.id, function(err, foundUser) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      Restaurant.find().where('author').equals(foundUser._id).exec(function(err, restaurants) {
        if(err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("/");
        }
        Review.find().where('author').equals(foundUser._id).exec(function(err, reviews) {
            if(err) {
              req.flash("error", "Something went wrong.");
              return res.redirect("/");
            }
        res.render("users/show", {user: foundUser, restaurants: restaurants, restaurantCount: restaurants.length, reviews: reviews, reviewsCount: reviews.length});
      });
    }); 
  });
}

//logout route
module.exports.logout=(req,res) =>{
    req.logout();
    req.flash('success', "You're logged out!");
    return res.redirect('/restaurants');
}


