require('dotenv').config();
const path = require("path")
const express = require("express");
const server = express();
const cookieParser = require('cookie-parser')
const {mongoDBConnect} = require("./connect")

mongoDBConnect().catch((err)=> console.log("Error : ", err));


//Acquiring all files -
const {staticRouter} = require('./III.routes/staticRoute');

const {urlRouter} = require('./III.routes/url-Shortener');
const {userRouter} = require('./III.routes/user');
const {restrictToLoggedinUserOnly} = require('./0.middlewares/jwtAuth')


const jwt = require("jsonwebtoken");
function checkAuthAtStaticLoginAndSignup(req , res , next){
 
    try {
        

        const fetchToken = req.cookies.jwtToken;

        if(!fetchToken) {
            
            
            return res.render("login.ejs", {loginErr : "Please Login!"})
        

        }else{

            
        const verifyjwtToken = jwt.verify(fetchToken, process.env.SECRET_KEY);
    
        // if(!verifyjwtToken) return res.render("Login.ejs", {loginErr : "Cookie Validation failed i.e Wrong Token Please check!"});
    
        //if everything went fine, we just keep the user
        // req.verifiedJWTUserId = verifyjwtToken ; //to see each user with verfied token details -

       
        // res.redirect('/');
        res.render('home.ejs')


        }
    

        
    } catch (error) {
        console.log("Error", error);
    
        return res.render("login.ejs", {loginErr : "Please Login!"})
        
    }
}






server.use(express.json()); //For JSON Data Parsing from HTTP Request Body
server.use(express.urlencoded({extended : false}));//For Form Data Parsing from 
server.use(cookieParser()); //third party middle ware to access the cookie from the header of the HTTP request.
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname,'0.views'))

//For Frontend/Client/Static Routes URL Routes -
// server.use("/", checkAuthAtStaticLoginAndSignup , staticRouter);  // Inidcates '/' at home Base_Route will render
server.use("/" , staticRouter);  // Inidcates '/' at home Base_Route will render


//For Backend i.e Server URL Routes -
server.use("/user",  userRouter); //for users login and signup at server.
server.use("/url", restrictToLoggedinUserOnly, urlRouter); //For URL shortener service for users. //added a inline middleware for auth using JWT auth.
//the base url here i.e '/url' all services accessible after getting passed from 2nd arg i.e Auth Middleware Passed, If not passed then it can't reach to 'urlRouter'.

const PORT = process.env.PORT || 8001;

server.listen(PORT, ()=> console.log(`Server has started on PORT = ${PORT}`));






