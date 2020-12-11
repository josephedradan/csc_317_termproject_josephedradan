/* 
Created by Joseph Edradan
Github: https://github.com/josephedradan

Date created: 

Purpose:

Details:

Description:

Notes:
    res.locals 
        lasts whiles it's being generated and sent back
    
    app.locals
        last entirety of program

    res.send(data)
        send content back to use
    
    res.end()
        no type header
    
    res.sendFile("./path" err => function)
        send back file
    
    res.json(jsonData)
        send back json
    
    res.redirect(http code, ./path )
        redirect
    
    res.format(...)
        return different types of content

    res.links(data)
        add link tags for other urls, send it in the header not the html
    
    res.render("view", locals, callback )
        uses template and uses view engine and the folder for the views
    
    res.set(data)
        set header
    
    res.append(data)
        add additional headers

    res.cookie(data ...)
        send cookie
    
    res.status(status).end()
        sending status

    res.type()
        send back response type

    res.attachment(file)
        sets content disposition header, file that the user will see
    
    res.endFile(file, callback)
        send file?

    res.download(path,name, callback)
        ask user to download file

IMPORTANT NOTES:
    *** DO NOT USE express-flash it will prevent express-sessions from removing sessions_id from the database

Explanation:

Reference:
    Express JS - Sending Headers, Content, Attachments and Statuses
        https://www.youtube.com/watch?v=w02YRfpYnS0
            Notes:
                Explanation of Express stuff

    Express JS - Settings, Variables & Locals
        https://www.youtube.com/watch?v=G6pmkVI2EKM
            Notes:
                Explanation of Express stuff

    Flash Express
        https://www.npmjs.com/package/flash-express
            Notes:
                "notifications that can work with any template engine"
    
    Better Error Handling In NodeJS With Error Classes
        https://www.smashingmagazine.com/2020/08/error-handling-nodejs-error-classes/

    
        
*/
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const loggerMorgan = require("morgan");
const expressHandlebars = require("express-handlebars");
const expressSessions = require("express-session");
const MySQLSession = require("express-mysql-session")(expressSessions);
// const expressFlash = require('express-flash'); // Buggy with express-sessions

const routerIndex = require("./routes/index"); // From routes/index.js
const routerUsers = require("./routes/users"); // From users/users.js
const routerPosts = require("./routes/posts");
const routerDatabase = require("./routes/database_test"); // Db testing TODO: FIXME

// Custom printer
const debugPrinter = require("./helpers/debug/debug_printer");

const handlebarHelpers = require("./helpers/handlebar_helpers");

const mySQLPrinter = require("./helpers/my_sql_printer");

// Asynchronous Function Middleware Handler
const middlewareAsyncFunctionHandler = require("./helpers/middleware_async_function_handler");

// Express object
const app = express();

// const SESSION_MAX_TIME = 1000 * 60 * 60 * 2

/* 
app.get()
app.post()
app.put()
app.delete()
*/

/* 
Set engine and set static folder for handlebars directory

*/
app.engine(
    "hbs",
    expressHandlebars({
        // Dir for layout
        layoutsDir: path.join(__dirname, "views/layouts"),

        // Default layout hbs based on layoutsDir
        defaultLayout: "base",

        // Dir for layouts/partials
        partialsDir: path.join(__dirname, "views/layouts/partials"),

        // Extension for handlebars
        extname: ".hbs",

        // Helper functions for you
        helpers: {
            // emptyObjectHelper: handlebarHelpers.emptyObject
        },
    })
);

const mySQLSessionStore = new MySQLSession(
    {
        /* Using default options */
    },
    require("./config/database_connecter")
);

/* 
*** Unmounted middleware ***

Reference:
    Express JS - Settings, Variables & Locals
        https://www.youtube.com/watch?v=G6pmkVI2EKM

*/
/* 
Express-sessions

Reference:
    https://www.youtube.com/watch?v=OH6Z0dJ_Huk
*/
app.use(
    expressSessions({
        // Key used in the from end
        key: "csid",

        // Sign the cookie
        secret: "session_cookie_secret",

        // Select a session store
        store: mySQLSessionStore,

        // Don't save when nothing is changed
        resave: false,

        // Don't save an empty value in this session
        saveUninitialized: false,

        // cookie: {
        //     sameSite: true,
        //     secure: true,
        // }
    })
);
app.set("view engine", "hbs"); // app.locals.settings["view engine"]
app.use(loggerMorgan("dev"));
app.use(express.json()); // Parse response
app.use(express.urlencoded({ extended: false })); // Parse response
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(expressFlash()); // Buggy with express-sessions

/* 
Unmounted middleware user defined

Notes:

*/
// Print information about the request
app.use(middlewareAsyncFunctionHandler(requestHandler));

async function requestHandler(req, res, next) {
    // res.locals (req.locals does not exist)
    debugPrinter.debugPrint(res.locals);

    // print request method
    // debugPrinter.requestPrint(req.method);

    // print request url
    // debugPrinter.requestPrint(req.url);

    // Debug print method and url
    debugPrinter.requestPrint(`${req.method}: ${req.url}`);

    // Call next middleware
    next();
}

// Express Session handling (Must be below expressSessions)
app.use(middlewareAsyncFunctionHandler(expressSessionHandler));

async function expressSessionHandler(req, res, next) {
    debugPrinter.debugPrint(req.session);

    // Print the session from the database
    // mySQLPrinter.printSessions();

    // If session.session_username exists
    if (req.session.session_username) {
        res.locals.session_logged = true;
        res.locals.session_username = req.session.session_username;
    }
    next();
}

/* 
*** Mounted middleware ***

Notes:
    Format (URL, Router module

*/
app.use("/", routerIndex); // app.locals.settings["/"]
app.use("/databaseTest", routerDatabase); // app.locals.settings["/databaseTest"]
app.use("/users", routerUsers); // app.locals.settings["/users"]
app.use("/posts", routerPosts); // app.locals.settings["/posts"]

/* 
*** Error Handling Middleware ***

Notes:
    If an error is caught, then this is called.

*/

app.use(middlewareAsyncFunctionHandler(saveSessionThenRedirect));

async function saveSessionThenRedirect(req, res, next) {
    // res.locals (req.locals does not exist)
    debugPrinter.debugPrint(res.locals);

    // Must force a save because redirect is TOO FAST COMPARED TO req to write to the Database
    req.session.save((err) => {
        // Handle errors
        if (err) {
            next(err);
        } else {

            // Get location of Redirect based on res.locals.last_redirect
            let location = res.locals.last_redirect;

            // Redirect user
            res.redirect(location);
        }
    });

    // rq.session.save() does not support promise, it's just a callback which is why you can't await i think...
    /* 
    req.session.save().then(() => {
        // Get location of Redirect based on res.locals.last_redirect
        let location = res.locals.last_redirect;

        // Redirect user
        res.redirect(location);
    }).catch(err => {
        next(err);
    })
    */


}

app.use(errorHandler);

function errorHandler(err, req, res, next) {
    // Use the debugPrinter's errorPrint function to print message to console
    debugPrinter.errorPrint(err);

    // Render error page with error message
    // TODO: error.hbs does not exist so you will get another error
    // res.render('error', { err_message: err })
}

// Export app
module.exports = app;
