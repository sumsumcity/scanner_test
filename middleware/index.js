const user = require("../models/user");
let middlewareObject = {};

//a middleware to check if a user is logged in or not
middlewareObject.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/signin");
};

middlewareObject.tokenChecker = (req, res, next) => {
  if (!req.secretToken) {
    return next();
  }
  res.redirect("/");
};

middlewareObject.routeAdministration = async (req, res, next) => {
  if (await user.isValidUser() == 0) {
    req.session.invalidUser = true;
  }else{

    req.session.invalidUser = false;
  }
  return next();
};

middlewareObject.validUser = (req, res, next) => {
  if (req.originalUrl == "/mfa") {
    return next();
  }
  if (req.session.invalidUser) {
    res.redirect("/mfa");
  }
  else{
    return next();
  }
}

middlewareObject.adminRequired = async (req, res, next) => {
  let id = req.user && req.user.id
  let User = await user.findOne({_id: id})
  let isAdmin = User && User.admin

  if (!isAdmin) {
    req.flash('messageFailure', 'Admin only')
    return res.redirect('/')
  }

  next();
}


module.exports = middlewareObject;
