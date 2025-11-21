const express = require("express");
const server = express();
PORT = 8001;
require('dotenv').config();
const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

module.exports = {PORT};

const {urlRouter}  = require("./III.routes/url-Shortener");
const {userRouter} = require("./III.routes/user");

const {uiRouter}  = require("./III.routes/staticRoute");

const urlModel = require("./I.models/url-Shortener");

const {restrictToLoggedinUserOnly, checkAuth } = require("./0.middlewares/jwtAuth")

const path = require("path"); //Nodejs buildin module to work with file directory in the project folder and file path



server.use(express.json()); //For JSON Data Parsing from HTTP Request Body
server.use(express.urlencoded({extended : false}));//For Form Data Parsing from HTTP Request Body
//Here, we supporting both type of data recieved from HTTP body.
server.use(cookieParser());



//For Backend/Server URL Routes -
server.use("/url", verifyToken, urlRouter);  //I want /user all services get accessible after passing the 2nd argument passed if not passed then it cant reach to 'urlRouter' simple.

server.use("/user",  userRouter); 


//For Frontend/Client/static Routes URL Routes -
server.use("/", verifyToken, uiRouter); //Inidcates '/' at home base_Route will render

function verifyToken(req, res, next){

        const takeToken = req.cookies.jwtToken ;
        
        if(typeof takeToken !== 'undefined' ){
            
            const verifyToken = jwt.verify(takeToken, process.env.SECRET_KEY);
            req.token = verifyToken ;
            next();

        }else{

            // res.redirect('/login');
            // res.json({masg : "Invalid TOken"}) 
             res.render("login.ejs", {loginErr : "Please Login!"})      
         }

}


// -----------------------------------------------------------------------

    // i) For Testing : Sending the HTML Page(Harcore Encoded On Same Backend Page) To UI with backend Data -

server.get("/test", async (req, res)=>{

    const allDocs = await urlModel.find({}); //array of objects
    const htmlString = allDocs.map(item => ` <h3> Shortener Id : ${item.
                shortenerId}, Redirect To : ${item.redirectURL
                }, and Visits : ${item.visitHistory.length} </h3>` ).join(' ')
    
    // console.log(htmlString)

    // res.cookie("token", "wowghgg");

    //res.end("<h1>Hello from Server side</h1>");
    res.send(htmlString); //send() method sends any string data to client with text/html type.

});

// -----------------------------------------------------------------------------


    // ii) For Testing : Sending the HTML Page(Using ejs i.e embedded javascript templating language on seperate page) To UI with dynamic data from backend/server side -



 //EJS : EJS stands for Embedded Javascript. It is a templating language that allow users to generate HTML markup by emnedding javascript code within HTML templates. EJS is a popular choice for web development at SSR in nodejs.
 
 //.ejs files are more similar like HTMP files with ejs syntax for variable insertion.
 
 //Setup of EJS in NodeJS Project :-

//For Setting EJS as templating 'view engine' to expressJS, we used server.set() of expressJS, In set() method, the first paramter is already predefined as 'view engine' where we tell which 'Template View engine' we are are using.

server.set('view engine', 'ejs'); //Remember, Bydefault ejs look for all view folder inside only the 'views' folder under the project root folder, so user must define a folder name with "views" and file names for .ejs template.

// server.set('view engine', 'ejs') means telling express that we are using "view engine" for the project as "ejs" templating language.


server.set('views', path.resolve('./0.views')); //for settig if we keep views folder not in default hirachy of ejs defination then we need to set predefined "views" key to the "path" of our views folder. //We can use path module for better resolution with path// ByDefault, ejs look at the default views folder at path file as './views' i.e path.resolve('./views')

// server.set('views', path.resolve('./views')) means telling express that we kept 'views' name folder at provided path file, for getting used by templating lagungage; i.e templating language lookup the views folder at the given path.

// console.log(path.resolve("./views"));


// --------------------------------------------------------------------------

server.get("/test2", (req, res)=>{

    const user = {
        name : "Prakash Verma",
        email : "prakash123@gmail.com",
        city :"kolkata",
        skills : ["php", "js", "c++", "javascript", "nodejs"]
    }

    // res.render("test2.ejs");

    res.render("test2.ejs", {
        userData : user,
        name : "Prakash"
    });
 

});


//Sending the mongodb data to html i.e ejs file -
server.get("/test3", async (req, res)=>{

    const allDocs = await urlModel.find({}); 

    res.render('test3.ejs', {
        urls : allDocs,
        name : "Prakash Verma"
    })

})


//-------------------------------------------------------------------------


server.listen(PORT, ()=> console.log(`Server has started on PORT = ${PORT}`));


