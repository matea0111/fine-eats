const User = require('../models/user');
const {cloudinary} = require("../cloudinary"); 
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');


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


module.exports.deleteUser = async (req,res) => {
    const {id} = req.params;
    await User.findByIdAndDelete(id);
    req.flash('success', 'You successfully deleted a User');
    return res.redirect('/users/usermanagment')
}

module.exports.manage = async(req, res) => {
    const users = await User.find({});  
    res.render('users/usermanagment', {users: users});
}


module.exports.toggleAdmin = async (req,res) => {
    console.log(req.params);
    const {id} = req.params;
    let user = await User.findById(id);
    user.isAdmin =!user.isAdmin;
    await user.save();
}
