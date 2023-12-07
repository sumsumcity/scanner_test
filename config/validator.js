const { check, validationResult } = require("express-validator");

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MAX_PASSWORD_LENGTH = 128;
const userSignUpValidationRules = () => {
  return [
    check("name", "Name is required").not().isEmpty(),
    check("name", "Name cannot be longer than " + MAX_NAME_LENGTH+ " characters").isLength({ max: MAX_NAME_LENGTH }),
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("email", "Email cannot be longer than " + MAX_EMAIL_LENGTH + " characters").isLength({ max: MAX_EMAIL_LENGTH }),
    check("password", "Password cannot be longer than " + MAX_PASSWORD_LENGTH + " characters").isLength({ max: MAX_PASSWORD_LENGTH }),
    check("password", "Please enter a complex password of length 10, including one lowercase character, one uppercase character, one number as well as one special character")
      .isStrongPassword({
        minLength: 10,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
  ];
};


const userSignInValidationRules = () => {
  return [
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("password", "Invalid password").not().isEmpty().isLength({ min: 4 }),
  ];
};

const userContactUsValidationRules = () => {
  return [
    check("name", "Please enter a name").not().isEmpty(),
    check("email", "Please enter a valid email address")
      .not()
      .isEmpty()
      .isEmail(),
    check("message", "Please enter a message with at least 10 words")
      .not()
      .isEmpty()
      .isLength({ min: 10 }),
  ];
};

const validateSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signup");
  }
  next();
};

const userUpdateValidationRules = () => {
  return [
    check("username", "Name is required").not().isEmpty(),
    check("username", "Name cannot be longer than " + MAX_NAME_LENGTH+ " characters").isLength({ max: MAX_NAME_LENGTH }),
    check("email", "Invalid email").not().isEmpty().isEmail(),
    check("email", "Email cannot be longer than " + MAX_EMAIL_LENGTH + " characters").isLength({ max: MAX_EMAIL_LENGTH }),
    check("password", "Password cannot be longer than " + MAX_PASSWORD_LENGTH + " characters").isLength({ max: MAX_PASSWORD_LENGTH }),
    check("password").custom((value, { req }) => {
      if (value !== '') {
        if (!value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%()~*?&]{10,}$/)) {
          throw new Error("Please enter a complex password of length 10, including one lowercase character, one uppercase character, one number as well as one special character");
        }
      }
      return true;
    }),
  ];
};
const validateUpdate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/a0MNAc/user/" +req.body.userid);
  }
  next();
};
const validateSignin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    req.flash("error", messages);
    return res.redirect("/user/signin");
  }
  next();
};

const validateContactUs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var messages = [];
    errors.array().forEach((error) => {
      messages.push(error.msg);
    });
    console.log(messages);
    req.flash("error", messages);
    return res.redirect("/pages/contact-us");
  }
  next();
};

module.exports = {
  userSignUpValidationRules,
  userUpdateValidationRules,
  userSignInValidationRules,
  userContactUsValidationRules,
  validateSignup,
  validateUpdate,
  validateSignin,
  validateContactUs,
};
