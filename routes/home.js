const homeRoutes = (app, fs) => {
    
    // The Default route to handle / requests. This will render the home page.
    app.get('/', (req, res) => {
        res.render('home.pug');
    });
    // The Default route to handle / requests. This will render the home page.
    app.get('/changenotes', (req, res) => {
        res.render('changenotes.pug');
    });

}

module.exports = homeRoutes;