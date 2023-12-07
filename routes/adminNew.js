const express = require("express");
const router = express.Router();
//const csrf = require("csurf");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
const Product = require("../models/product");
const Order = require("../models/order");
const Cart = require("../models/cart");
const User = require("../models/user");

const middleware = require("../middleware");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { signUpLimit, signInLimit } = require('../config/limiter');

const {
    userSignUpValidationRules,
    userUpdateValidationRules,
    userSignInValidationRules,
    validateSignup,
    validateUpdate,
    validateSignin,
} = require("../config/validator");

// const csrfProtection = csrf();
// router.use(csrfProtection);

// GET: display the signin form with csrf token
router.get("/", middleware.isNotLoggedIn, (req, res) => {
    var errorMsg = req.flash("error")[0];
    res.render("admin/admin_signin", {
        csrfToken: req.csrfToken(),
        errorMsg,
        pageName: "Sign In",
    });
});

// POST: handle the signin logic
router.post("/",
    signInLimit,
    [
        middleware.isNotLoggedIn,
        userSignInValidationRules(),
        validateSignin,
        passport.authenticate("local.Adminsignin", {
            failureRedirect: "/a0MNAc",
            successRedirect: '/a0MNAc/panel',
            failureFlash: true,
        }),
    ],

);

router.get("/panel", middleware.isLoggedIn, middleware.adminRequired, (req, res) => {
    var errorMsg = req.flash("error")[0];
    res.render("admin/panel", {
        errorMsg,
        pageName: "Panel",
    });
});

function transformData(docs) {
    const data = {};

    // Iterate over each document
    docs.forEach(doc => {
        // Iterate over each property in the document
        for (let prop in doc.toObject()) {
            // If the property is not in the data object, add it
            if (!data[prop]) {
                data[prop] = [];
            }

            // Check if the property is an array
            if (Array.isArray(data[prop])) {
                // Add the value of the property to the data object
                data[prop].push(doc[prop]);
            }
        }
    });

    return data;
}

router.get("/panel/users", middleware.isLoggedIn,middleware.adminRequired, async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
    try {
        // find all orders of this user
        allUsers = await User.find();
        data = transformData(allUsers)
        delete data["__v"]
        delete data["password"]
        res.render("admin/users", {
            users: data,
            errorMsg,
            successMsg,
            csrfToken: req.csrfToken(),
            pageName: "Users",
            adminEmail: process.env.ADMIN_EMAIL,

        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});

router.get("/panel/products", middleware.isLoggedIn, middleware.adminRequired, async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
    try {
        // find all orders of this user
        allProducts = await Product.find();
        data = transformData(allProducts)
        delete data["description"]
        delete data["__v"]
        delete data["imagePath"]
        delete data["_id"]
        res.render("admin/products", {
            products: data,
            errorMsg,
            successMsg,
            pageName: "Products",
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});

router.get('/user/:id', middleware.isLoggedIn, middleware.adminRequired,async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
    try {
        // find all orders of this user
        // allProducts = await Product.find();
        let user = await User.findOne({ _id: req.params.id });
        // console.log(data)
        // delete data["description"]
        // delete data["__v"]
        // delete data["imagePath"]
        // delete data["_id"]
        res.render("admin/editUser", {
            user: user,
            csrfToken: req.csrfToken(),
            errorMsg,
            successMsg,
            pageName: "Edit User",
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});

router.delete('/user/:id', middleware.isLoggedIn, middleware.adminRequired,async (req, res) => {
    try {
        // Use the deleteOne method
        // const result = await User.deleteOne({ _id: req.params.id });

        // Or use the findByIdAndDelete method
        const result = await User.findByIdAndDelete(req.params.id);

        if (result) {
            //res.send('User deleted successfully');
            //res.redirect("/a0MNAc/panel/users")
            res.status(200).send('User deleted');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send('Server error');
    }
});

async function isEmailTaken(email, userId) {
    const user = await User.findOne({ email: email });
    if (user) {
        if (userId && user._id.toString() === userId.toString()) {
            // If the email belongs to the user being updated, return false
            return false;
        } else {
            // If the email belongs to another user, return true
            return true;
        }
    } else {
        // If the email is not taken, return false
        return false;
    }
}

router.post('/user/:id', middleware.isLoggedIn, middleware.adminRequired,
    userUpdateValidationRules(),
    validateUpdate,
    async (req, res) => {
    //const successMsg = req.flash("success")[0];
    //const errorMsg = req.flash("error")[0];
    try {

        let updatedUser = await User.findOne({ _id: req.params.id });
        if (await isEmailTaken(req.body.email, req.params.id)) {
            req.flash("error", "Email is already taken");
            return res.redirect("/a0MNAc/user/"+req.params.id);
        }
        updatedUser.username = req.body.username;
        updatedUser.email = req.body.email;

        if(req.body.password !== ''){
            updatedUser.password = updatedUser.encryptPassword(req.body.password);
        }
        await updatedUser.save();
        res.redirect("/a0MNAc/panel/users")



    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        return res.redirect("/");
    }
});

router.get("/panel/orders", middleware.isLoggedIn, middleware.adminRequired, async (req, res) => {
    const successMsg = req.flash("success")[0];
    const errorMsg = req.flash("error")[0];
    try {
        // find all orders of this user
        allProducts = await Order.find();
        data = transformData(allProducts)
        console.log(data)
        // delete data["description"]
         delete data["__v"]
        // delete data["imagePath"]
        // delete data["_id"]
        res.render("admin/orders", {
            products: data,
            errorMsg,
            successMsg,
            pageName: "Orders",
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});


module.exports = router;