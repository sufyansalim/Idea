const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOveride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require('passport');
const mongoose = require("mongoose");

const app = express();

//Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Passport Config
require('./config/passport')(passport);
//DB Config
const db= require("./config/database");


//Not Necessary
// Map Global promise  - get rid of warnings
// mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose
  .connect(db.mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));


//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Method overide middleware
app.use(methodOveride("_method"));

//Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

// How middleware works
// app.use(function(req, res,next){
//     next();
// })

//Index Route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title,
  });
});

//About Route
app.get("/about", (req, res) => {
  res.render("about");
});



//User Login Route


//Use routes
app.use("/ideas",ideas);
app.use("/users",users);


const port = 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
