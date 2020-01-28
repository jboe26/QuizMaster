var express = require("express");
var logger = require("morgan");
var mongoose = require('mongoose');
var User = require('./models/user.js');
var session = require('client-sessions');
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// var MONGODB_URI =  'mongodb://localhost:27017/mon_auth';
// mongoose.connect(MONGODB_URI, {},  function(error) {
//     console.log("$$$$$$$$$$$$$$$$$$$",error)
//   });
var MONGODB_URI = 'mongodb://localhost:27017/mon_auth';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function (err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});

//use sessions for tracking logins
app.use(session({
  cookieName: 'session',
  secret: 'work hard',
  cookie: {
    maxAge: 1000 * 60 * 60 * 12 // 12 hours
  },
  resave: true,
  saveUninitialized: false,// don't create session until something stored
  activeDuration: 5 * 60 * 1000,
}));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static(__dirname + "/public"));

// ----------------- ROUTES --------------------

// Signup Route to post our form submission to mongoDB via mongoose
app.post("/signup", function (req, res, next) {
  if (req.body.password !== req.body.password_Conf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    res.redirect("/signup.html")
    return next(err);
  } 
  // Create a new user using req.body
  User.create(req.body)
    .then(function () {
      // If saved successfully, Redirect to html page
      res.redirect("/login.html");
    })
    .catch(function (err) {
      // If an error occurs, send the error to the client
      res.json(err);
    });
});

// Login Route to post our form submission to mongoDB via mongoose
app.post("/login", function (req, res, next) {
  console.log("attempt to authenticate user")
  User.authenticate(req.body.logusername, req.body.logpassword, function (error, user, reason) {
    if (error || !user) {
      var reasons = User.failedLogin;
      switch (reason) {
        case reasons.NOT_FOUND:
          console.log("not found");
          res.sendStatus(404);
          res.redirect("/login.html");
          break;
        case reasons.PASSWORD_INCORRECT:
          console.log("incorrect password");
          res.sendStatus(400);
          res.redirect("/login.html");
          // note: these cases are usually treated the same - don't tell
          // the user *why* the login failed, only that it did
          break;
        case reasons.MAX_ATTEMPTS:
          console.log("too many attempts");
          res.sendStatus(429);
          res.redirect("/login.html");
          // send email or otherwise notify user that account is
          // temporarily locked
          break;
      }
      // return next(error);
    } else {
      console.log('login success');
      req.session.user = user;
      return res.redirect("/main");
    }
  });
});

app.use(function(req, res, next) {
  console.log(req.session.user);
  if (req.session && req.session.user) {
    User.findOne({ username: req.session.user.username }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
    });
  } else {
    next();
  }
});
// TO DO: req.user is undefined. 
function requireLogin (req, res, next) {
  console.log("^^^^^^^^^^^^^^^^^^",req.user)
  if (!req.user) {
    res.redirect('/login.html');
  } else {
    next();
  }
};

app.get("/main", requireLogin, function(err, res){
  // console.log("Ready to render protected view");
  res.sendFile('main.html', {root : __dirname + '/protectedViews'});
  // res.sendFile("protectedViews/main.html");
});

// GET route after registering
app.get('/profile', requireLogin, function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});


// // GET for logout logout
// app.get('/logout', function (req, res, next) {
//   if (req.session) {
//     // delete session object
//     req.session.destroy(function (err) {
//       if (err) {
//         return next(err);
//       } else {
//         return res.redirect('/');
//       }
//     });
//   }
// });

var PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});