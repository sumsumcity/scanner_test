require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser')
const logger = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const Category = require("./models/category");
var MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/db");
const middlewareObject = require("./middleware");
const { limit } = require('./config/limiter');
const helmet = require('helmet')
const csurf = require("tiny-csrf");


const app = express();
require("./config/passport");

const Waf = require('./lib/mini-waf/wafbase');
const {DefaultSettings} = require('./config/wafrule');



// mongodb configuration
const db = connectDB();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(limit)



app.use(Waf.WafMiddleware(DefaultSettings))


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("cookie-parser-secret"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    //session expires after 3 hours
    cookie: { maxAge: 60 * 1000 * 60 * 3,
              sameSite: 'strict'},
  })
);
app.use(csurf("OEifXYD0EYrq9YVoXjRFu4fxNpfsyu3M"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": [
        "code.jquery.com",
        "cdn.jsdelivr.net",
        "stackpath.bootstrapcdn.com",
        "api.mapbox.com",
        "js.stripe.com",
        "'self'",
      ],
      "script-src-elem": [
        "code.jquery.com",
        "cdn.jsdelivr.net",
        "stackpath.bootstrapcdn.com",
        "kit.fontawesome.com",
        "api.mapbox.com",
        "js.stripe.com",
        "'self'",
      ],
      "style-src": ["stackpath.bootstrapcdn.com", "api.mapbox.com", "fontawesome.com", "'self'", "'unsafe-inline'"],
      "connect-src": ["ka-f.fontawesome.com", "'self'"],
      "object-src": ["'self'"],
      "script-src-attr": ["'self'"],
      "img-src": ['*', "data:"],
      "frame-src": ["js.stripe.com", "'self'"],
    },
  }
}))

app.use(middlewareObject.tokenChecker);
app.use(middlewareObject.routeAdministration);
app.use(middlewareObject.validUser);

// global variables across routes
app.use(async (req, res, next) => {
  try {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.currentUser = req.user;
    const categories = await Category.find({}).sort({ title: 1 }).exec();
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// add breadcrumbs
get_breadcrumbs = function (url) {
  var rtn = [{ name: "Home", url: "/" }],
    acc = "", // accumulative url
    arr = url.substring(1).split("/");

  for (i = 0; i < arr.length; i++) {
    acc = i != arr.length - 1 ? acc + "/" + arr[i] : null;
    rtn[i + 1] = {
      name: arr[i].charAt(0).toUpperCase() + arr[i].slice(1),
      url: acc,
    };
  }
  return rtn;
};
app.use(function (req, res, next) {
  req.breadcrumbs = get_breadcrumbs(req.originalUrl);
  next();
});



//routes config
const indexRouter = require("./routes/index");
const productsRouter = require("./routes/products");
const usersRouter = require("./routes/user");
const adminRouter = require("./routes/adminNew")
const pagesRouter = require("./routes/pages");
const User = require("./models/user");
app.use("/products", productsRouter);
app.use("/user", usersRouter);
app.use("/a0MNAc", adminRouter);
app.use("/pages", pagesRouter);
app.use("/", indexRouter);
//app.get('*', (req, res) => {
//  res.redirect('/');
//});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  res.locals.error = req.app.get("env") === "local" ? err : {};
  // res.locals.error = {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

var port = process.env.PORT || 3000;
app.set("port", port);
app.listen(port, () => {
  console.log("Server running at port " + port);
});


module.exports = app;
