const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (user) {
          bcrypt.compareSync("", '$2a$12$Cs3ArdaorKKWH8WxT/T9hOPuRjRZ6sck/dVo1sIkSapdH2SZvq30S');
          return done(null, false, { message: "Email already exists" });
        }
        if (password != req.body.password2) {
          bcrypt.compareSync("", '$2a$12$Cs3ArdaorKKWH8WxT/T9hOPuRjRZ6sck/dVo1sIkSapdH2SZvq30S');
          return done(null, false, { message: "Passwords must match" });
        }
        const newUser = await new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.username = req.body.name;
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: false,
    },
    async (email, password, done) => {
        try {
        const user = await User.findOne({ email: email });
        if (!user) {
          bcrypt.compareSync("", '$2a$12$VLkrNA821tJZ9m1B628Am.pwBIMk0YG1qjxXFfzwSQUM1fXsnsI5u');
          return done(null, false, { message: "Wrong password or username" });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: "Wrong password or username" });
        }
        return done(null, user);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

// admin sign in

passport.use(
    "local.Adminsignin",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: false,
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email });
                if (email != process.env.ADMIN_EMAIL) {
                    bcrypt.compareSync(password, "$2a$12$Cs3ArdaorKKWH8WxT/T9hOPuRjRZ6sck/dVo1sIkSapdH2SZvq30S");
                    return done(null, false, { message: "Wrong password or username" });
                }
                if (!bcrypt.compareSync(password, process.env.ADMIN_PASSWORD)) {
                    return done(null, false, { message: "Wrong password or username" });
                }
                return done(null, user);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }
    )
);

