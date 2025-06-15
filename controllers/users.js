const User = require("../models/user");

module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=> {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email,username});
        let resisterd = await User.register(newUser, password);
        req.login(resisterd, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wonderland");
            res.redirect("/listings");
        });
        } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
        }
}

module.exports.renderLoginForm =  (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async(req,res) => {
    req.flash("success", "Welcome back to Wonderland");
    let redirectUrl = res.locals.redirectUrl || "/listings";
   return res.redirect(redirectUrl);
}

module.exports.logout = (req,res, next) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out");
       return  res.redirect("/listings");
    });
}