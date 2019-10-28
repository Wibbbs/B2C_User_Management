// load up our shiny new route for users
const userRoutes = require('./users');
const adduserRoutes = require('./adduser');

const appRouter = (app, fs) => {

    // we've added in a default route here that handles empty routes
    // at the base API url
    app.get('/', (req, res) => {
        //res.render('home');
        //res.render('home.ejs');
        res.render('layout.pug');
        
    });


    // run our user route module here to complete the wire up
    userRoutes(app, fs);
    adduserRoutes(app,fs);
};

// this line is unchanged
module.exports = appRouter;