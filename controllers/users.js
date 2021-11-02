const User = require('../models/user');

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
        avatar:req.body.avatar,
        email:req.body.email
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
    console.log(registeredUser);
    
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

//logout route
module.exports.logout=(req,res) =>{
    req.logout();
    req.flash('success', "You're logged out!");
    return res.redirect('/restaurants');
}

