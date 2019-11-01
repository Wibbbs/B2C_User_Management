//This file will be used to house simple routes.

const homeRoutes = (app, fs) => {
    
    // The Default route to handle / requests. This will render the home page.
    app.get('/', (req, res) => {
        //res.render('home.pug');
        res.render('index.ejs', { user: req.user });
    });
    // The Default route to handle / requests. This will render the home page.
    app.get('/changenotes', (req, res) => {
        res.render('changenotes.pug');
    });

}

module.exports = homeRoutes;