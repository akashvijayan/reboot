var middleObject = {};

middleObject.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports=middleObject;