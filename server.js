var express = require("express");
var logger = require("morgan");
var mongoose = require('mongoose');
var User = require('./models/user.js');
var session = require('client-sessions');
var PORT = process.env.PORT || 8080;
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));

// var MONGODB_URI =  'mongodb://localhost:27017/mon_auth';
// mongoose.connect(MONGODB_URI, {},  function(error) {
//     console.log("$$$$$$$$$$$$$$$$$$$",error)
//   });
// var MONGODB_URI = ('mongodb:<dbuser>:<dbpassword>@ds157276.mlab.com:57276/heroku_349kxrlp' || 'mongodb://localhost:27017/mon_auth');
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function (err) {
//   if (err) throw err;
//   console.log('Successfully connected to MongoDB', MONGODB_URI);
// });

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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mon_auth";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
console.log(MONGODB_URI);


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
          // res.sendStatus(404);
          res.redirect("/login.html");
          break;
        case reasons.PASSWORD_INCORRECT:
          // res.sendStatus(400);
          res.redirect("/login.html");
          // note: these cases are usually treated the same - don't tell
          // the user *why* the login failed, only that it did
          break;
        case reasons.MAX_ATTEMPTS:
          // res.sendStatus(429);
          res.redirect("/login.html");
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
app.use(express.static(__dirname + "/protectedViews/js")); 
function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/login.html');
  } else {
    next();
  }
};
function userInfo(req, res, next){
  cTitle = document.getElementById("cTitle");
  cTtxt = document.createTextNode("You got " + user.username + " questions right.   ");
  cTitle.appendChild(cTtxt);
}
app.get("/main", requireLogin, function(err, res){
  res.sendFile('main.html', {root : __dirname + '/protectedViews'});
});

app.get("/profile", requireLogin, function(req, res, next){
  User.findById(req.session.user).exec(function(error, user){
    return res.send("<span style='float:right; font-size: 32px;'> <a type='button' style='background-color: lightgray' href='/logout' text-size='65px'>Logout</a>    <a type='button' style='background-color: lightgray' href='/main'>HOME</a> </span>" + '<h2>Firstname: </h2>' + user.firstname + '<h2>Lastname: </h2>' + user.lastname + '<h2>Username: </h2>' + user.username + '<h2>Email: </h2>' + user.email + '<br>')
  })
});

app.get("/english", requireLogin, function(err, res){
  res.sendFile('english.html', {root : __dirname + '/protectedViews/quizViews'});
});
app.get("/geography", requireLogin, function(err, res){
  res.sendFile('geography.html', {root : __dirname + '/protectedViews/quizViews'});
});
app.get("/history", requireLogin, function(err, res){
  res.sendFile('history.html', {root : __dirname + '/protectedViews/quizViews'});
});
app.get("/math", requireLogin, function(err, res){
  res.sendFile('math.html', {root : __dirname + '/protectedViews/quizViews'});
});
app.get("/science", requireLogin, function(err, res){
  res.sendFile('science.html', {root : __dirname + '/protectedViews/quizViews'});
});

 // GET for logout logout
app.get('/logout', function(req, res){
  req.session.destroy(function(){
     console.log("user logged out.")
  });
  res.redirect('/login.html');
});


app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});