
const ShortUniqueId = require('short-unique-id');
const { randomUUID } = new ShortUniqueId({ length: 8 });

const urlModel = require("../I.models/url-Shortener");




//POST - Create the Shortener URL Random Unique ID Creation -

//We basically creating a unique id for each new long url entered by user and stores that unique id corresponding to long-url so to redirect to user to that original site by respective generated unique id -

async function handleGenerateShortenerID(req, res) {

    // console.log(req.body.url); //here 'url' is coming from client machine ie from front which user entered, for POST method we can test this using POST man where we send data in 'url' key to see that data created or not and stors at database or not.

    try{

        if(!req.body.url) return res.status(404).json({error : "URL is Required"});

        const id = randomUUID();
    
        await urlModel.create({
            shortenerId : id,
            redirectURL : req.body.url,
            // visitHistory : 
    
        })
    
        const allDocs = await urlModel.find();

        //Adding this function to get current protocol and host -        
        const baseUrl = req.protocol + "://" + req.get("host")
        // console.log(baseUrl)

        // return res.status(200).json({generated_Id : id})
        return res.render('home.ejs', {shortenerId : id, allDocs : allDocs , baseUrl : baseUrl}); //we send addition data to UI side for rendering all these data there aprat from 'home.ejs' which is required and 2nd parameter is optional. 


    }catch(err){
        console.log("Got Error : ", err)
        return res.redirect('/');
    }
   
    
}




//Get - Redirecting To Orginal Site From "url/unique-id" API -

async function reDirectToURL(req, res) {

    const shortId = req.params.shortID;
    const entry = await urlModel.findOneAndUpdate( {
        shortenerId : shortId} , {
        
        $push : { visitHistory : {
            timestamp : Date.now()
        }  }   


    } )


    // res.json(entry)
    res.redirect(301, entry.redirectURL);


    // res.redirect( 301 , "http://www.google.com");

    // Redirects can be a fully-qualified URL for redirecting to a different site:-

    // res.redirect('http://google.com')
    // res.redirect(301, 'http://example.com')
    // res.redirect('../login')


    
}

// Get - Disaplying API of The Json Data analytics -

async function handleGetAnalytics(req, res){

    const shortID = req.params.shortID;
    const result = await urlModel.findOne({shortenerId  : shortID});//retuns that single object which matched the shortID.
    // console.log("RESULT IS : ", result);
        res.json({
            totalClicks : result.visitHistory.length,
            analytics : result.visitHistory
        })
    
}


module.exports = {handleGenerateShortenerID, reDirectToURL, handleGetAnalytics};