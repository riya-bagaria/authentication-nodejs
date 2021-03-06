var express=require("express");
var app=express();
var mongoose=require("mongoose");
var passport=require("passport");
var bodyParser=require("body-parser");
var User=require("./models/user");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app");

app.use(require("express-session")({
    secret:"Rusty is the best and cutest dog in the world",
    resave:false,
    saveUninitialized:false
}));

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================================================
//ROUTES
//================================================
app.get("/",function(req,res){   
        res.render("home");
});

app.get("/secret",isLoggedIn,function(req,res){
        res.render("secret");
});

//AUTH ROUTES

//SIGN up uth
app.get("/register",function(req,res){
    res.render("register");
});

//HANDLING USER SIGN UP
app.post("/register",function(req,res){
    User.register(new User({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
                res.redirect("/secret");
        });
    });
});

//LOGIN FORM
app.get("/login",function(req,res){
    res.render("login");
});
//login logic
app.post("/login",passport.authenticate("local",{
    successRedirect:"/secret",
    failureRedirect:"/login"
}),function(req,res){
if(err){
    console.log(err);
}
else{

}
});

//logout
app.get("/logout",function(req,res){
      req.logout();
      res.redirect("/");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){

        console.log("succesfully done!!");
    
});