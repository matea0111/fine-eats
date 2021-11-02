const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync=require('../helpers/wrapAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const Restaurant = require('../models/restaurant');
const {checkProfileOwnership} =  require('../middleware');


router.route('/register')
    .get(users.showRegister)
    .post(wrapAsync(users.userRegistration))

router.route('/login')
    .get(users.showLogin)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}),(users.Login))

router.get('/logout', (users.logout))
module.exports = router;

//user profiles
router.get("/users/:id", (req, res) => {
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
      res.render("users/show", {user: foundUser, restaurants: restaurants});
    })
  });
});


