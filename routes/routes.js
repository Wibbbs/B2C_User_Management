// load up our shiny new route for users
const userRoutes = require('./users');
const adduserRoutes = require('./adduser');
const homeRoutes = require('./home')
const loginRoutes = require('./login')

const appRouter = (app, fs) => {
    // Hook up routes from other files to the main app.
    userRoutes(app, fs);
    adduserRoutes(app,fs);
    homeRoutes(app,fs);
    loginRoutes(app,fs);
};

// this line is unchanged
module.exports = appRouter;