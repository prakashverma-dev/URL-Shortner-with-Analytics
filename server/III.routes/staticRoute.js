
const express = require("express")
const staticRouter = express.Router();

// const urlModel = require("../I.models/url-Shortener");
// const userModel = require("../I.models/user");


// const auth = require('../0.middlewares/basicAuth')


//All FrontEnd Pages for UI Routes -

//Signup Page UI API -
staticRouter.get("/signup", async (req, res) => {

    // const allDocs = await urlModel.find({});
    res.render('signup.ejs');
    
});


//Login Page UI API -
staticRouter.get("/login", async (req, res) => {

    // const allDocs = await urlModel.find({});
    res.render('login.ejs');
    
});


//HomePage UI API -
staticRouter.get("/", async (req, res)=> {

    res.render('home.ejs'); 

  //res.render('Home.ejs', {allDocs : allDocs, PORT : PORT }); //We can send a single object with key-value pair or only value.
    
});


module.exports = {staticRouter};