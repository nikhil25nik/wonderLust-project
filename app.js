if(process.env.NODE_ENV != "production"){
    require("dotenv").config()
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");




const listingsRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");



// const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";

const dbUrl = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connect to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret:"mysupersecretkey",
    },
    touchAfter:24 * 36000,
});

store.on("error",() =>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOption = {
    store,
    secret:"mysupersecretkey",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 *24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}


////////
app.use((req, res, next) => {
    res.locals.search = req.query.search || "";
    res.locals.sort = req.query.sort || ""; // Ensuring sort is always available
    next();
});

app.use(flash());
app.use(session(sessionOption));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async(req,res) =>{
//     let fakeUser = new User({
//         email:"student@gamil.com",
//         username:"sigma-student"
//     });
    
//     let registeredUser =  await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
    
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);


//reviews


// app.get("/listing", async(req,res) =>{
//     let sampleListing = new listing({f
//         title:"My new villa",
//         discription:"By a beach",
//         price:1200,
//         location:"Calanguate, Goa",
//         country:"India",
//     });

//     await sampleListing.save()
//     console.log("sample was saved");
//     res.send("successful testing");

// });



// app.get("/", (req, res) => {
//     res.send("Hi i am root");
// });

app.get("/privacy",(req,res) =>{
    res.render("privacy.ejs");
});
app.get("/terms",(req,res) =>{
    res.render("terms.ejs");
});


app.all("*",(req,res,next) =>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
   let {statusCode = 500, message = "Something Went Wrong!"} = err;
   res.status(statusCode).render("error.ejs",{message});
//    res.status(statusCode).send(message);
});

app.listen(8080, (req, res) => {
    console.log("server is listening on port 8080");
});