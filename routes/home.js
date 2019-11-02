//This file will be used to house simple routes.

const homeRoutes = (app, fs) => {
    
    // The Default route to handle /error requests. This will render the home page.
    app.get('/error', (req, res) => {
        if (req.isAuthenticated()) {
            res.render('error.pug')
        }
        else {
            res.redirect('/');
        }
    });

    // The Default route to handle / requests. This will render the home page.
    app.get('/changenotes', (req, res) => {
        if (req.isAuthenticated()) {
            res.render('changenotes.pug')
        }
        else {
            res.redirect('/');
        }
    });

}

module.exports = homeRoutes;