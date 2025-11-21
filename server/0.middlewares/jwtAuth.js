require('dotenv').config()
const jwt = require("jsonwebtoken");
// console.log(process.env.<Variable_Name>);

 function restrictToLoggedinUserOnly(req, res, next) {

    try {

        const fetchUserToken = req.cookies.jwtToken;
        if(!fetchUserToken) return res.render("login.ejs", {loginErr : "Please Login!"})
    
    
        //If that user has jwt token, then we will verify that token with our jwt library if it fake token or not, then only we allow to access homepage of application -
    
        const verifyUserToken = jwt.verify(fetchUserToken, process.env.SECRET_KEY);
    
        if(!verifyUserToken) return res.render("login.ejs", {loginErr : "Please Login, Wrong JWT Token Found In the Cookie! "});
    
        //if everything went fine, We store that user in http headers of the client with a key name(for identifying that user indivisually) -
    
        req.verifiedJWTUserId = verifyUserToken ; //to see each user with verfied token details - 
        
        next();

  
    } catch (error) {
        console.log("Error", error);
    
        return res.render("login.ejs", {loginErr : "Something Went Wrong at the Server side i.e 500 C ode.. Please Login!"})
        
    }
    
}




module.exports = {restrictToLoggedinUserOnly}