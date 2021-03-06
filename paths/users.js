const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync=require('../helpers/wrapAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const Restaurant = require('../models/restaurant');
const {isLoggedIn,checkProfileOwnership} =  require('../middleware');
const multer =require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});

router.route('/register')
    .get(users.showRegister)
    .post(upload.single('avatar'),wrapAsync(users.userRegistration))

router.route('/login')
    .get(users.showLogin)
    .post(passport.authenticate('local',{failureFlash:true, failureRedirect: '/login'}),(users.Login))




router.route("/manage")
.get(isLoggedIn, users.manage)

router.route("/manage")
.post(isLoggedIn, users.manage)

router.route('/toggleAdmin')
.post(isLoggedIn, users.toggleAdmin)

router.route('/deleteuser')
.post(isLoggedIn ,users.deleteUser)

router.get('/logout', (users.logout))
//user profiles
router.route("/users/:id")
.get(users.showProfile);

router.route("/users/:id/edit")
.get(isLoggedIn, checkProfileOwnership,function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            res.render("users/edit", {user: foundUser});
        }
    });
});

router.route("/users/:id/edit")
.post(isLoggedIn, upload.single('avatar'),checkProfileOwnership, users.update);

router.route("/users/:d/edit/avatar")
.post(isLoggedIn, checkProfileOwnership, users.updateAvatar);

module.exports = router;

