const loginRoutes = (app, fs) => {
    var methodOverride = require('method-override');
    var expressSession = require('express-session');
    var cookieParser = require('cookie-parser');
    var passport = require('passport');
    var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
    var passport = require('passport');
    var bunyan = require('bunyan');
    var destroySessionUrl = 'https://login.microsoftonline.com/andrewtestingb2c.onmicrosoft.com/oauth2/v2.0/logout?p=B2C_1_signinv2&post_logout_redirect_uri=http://localhost:3001'

    var log = bunyan.createLogger({
        name: 'Microsoft OIDC Example Web Application'
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
    };

    passport.serializeUser(function (user, done) {
        console.log('serialize called');
        done(null, user.oid);
    });

    passport.deserializeUser(function (oid, done) {
        console.log('deserialze called');
        findByOid(oid, function (err, user) {
            done(err, user);
        });
    });

    // array to hold logged in users
    var users = [];

    var findByOid = function (oid, fn) {
        for (var i = 0, len = users.length; i < len; i++) {
            var user = users[i];
            console.log('we are using user: ', user);
            if (user.oid === oid) {
                return fn(null, user);
            }
        }
        return fn(null, null);
    };


    //Setup Passport
    passport.use(new OIDCStrategy({
        identityMetadata: 'https://login.microsoftonline.com/andrewtestingb2c.onmicrosoft.com/v2.0/.well-known/openid-configuration',
        clientID: '6316624b-bb50-45e6-b535-e88fd3eac57c',
        responseType: 'code id_token',
        responseMode: 'form_post',
        redirectUrl: 'http://localhost:3001/auth/openid/return',
        allowHttpForRedirectUrl: true,
        clientSecret: '30uq.2u.=fXonZJ7CVXFQPH.P[A:Qvx-',
        validateIssuer: true,
        isB2C: true,
        issuer: null,
        passReqToCallback: false,
        scope: ['offline_access'],
        loggingLevel: 'info',
        nonceLifetime: null,
        nonceMaxAmount: 5,
        useCookieInsteadOfSession: true,
        cookieEncryptionKeys: [
            { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
            { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
        ],
        clockSkew: null,
    },


        function (iss, sub, profile, accessToken, refreshToken, done) {
            if (!profile.oid) {
                return done(new Error("No oid found"), null);
            }
            console.log('passport.use called')
            // asynchronous verification, for effect...
            process.nextTick(function () {
                findByOid(profile.oid, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        // "Auto-registration"
                        users.push(profile);
                        return done(null, profile);
                    }
                    return done(null, user);
                });
            });
        }
    ));

    app.get('/', (req, res) => {
        if (req.user){
            res.render('home_auth.pug', { user: req.user })
        }
        else{
            res.render('home_noauth.pug', { user: req.user });
        }
        
    });

    app.get('/login',
        function (req, res, next) {
            console.log('passport.authenticate called');
            passport.authenticate('azuread-openidconnect',
                {
                    response: res,                      // required
                    //resourceURL: config.resourceURL,    // optional. Provide a value if you want to specify the resource.
                    customState: 'my_state',            // optional. Provide a value if you want to provide custom state value.
                    failureRedirect: '/error',
                    session: false
                }
            )(req, res, next);
        },
        function (req, res) {
            log.info('Login was called in the Sample');
            res.redirect('/');
        });


    // 'GET returnURL'
    // `passport.authenticate` will try to authenticate the content returned in
    // query (such as authorization code). If authentication fails, user will be
    // redirected to '/' (home page); otherwise, it passes to the next middleware.
    app.get('/auth/openid/return',
        function (req, res, next) {
            console.log('get on return url');
            passport.authenticate('azuread-openidconnect',
                {
                    response: res,                      // required
                    failureRedirect: '/error'
                }
            )(req, res, next);
        },
        function (req, res) {
            console.log('We received a GET return on /auth/openid/return from AzureAD.');
            res.redirect('/');
        });

    // 'POST returnURL'
    // `passport.authenticate` will try to authenticate the content returned in
    // body (such as authorization code). If authentication fails, user will be
    // redirected to '/' (home page); otherwise, it passes to the next middleware.
    app.post('/auth/openid/return',
        function (req, res, next) {
            console.log('post on return URL')
            passport.authenticate('azuread-openidconnect',
                {
                    response: res,                      // required
                    failureRedirect: '/error'
                }
            )(req, res, next);
        },
        function (req, res) {
            console.log('We received a POST return on /auth/openid/return return from AzureAD.');
            res.redirect('/');

        });

    // 'logout' route, logout from passport, and destroy the session with AAD.
    app.get('/logout', function (req, res) {
        req.session.destroy(function (err) {
            req.logOut();
            res.redirect(destroySessionUrl);
        });

    })
}

module.exports = loginRoutes;