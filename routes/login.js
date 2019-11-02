const loginRoutes = (app, fs) => {
    var methodOverride = require('method-override');
    var expressSession = require('express-session');
    var cookieParser = require('cookie-parser');
    var passport = require('passport');
    var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
    var passport = require('passport');
    var bunyan = require('bunyan');
    var destroySessionUrl = process.env.authB2C_destroySessionUrl;
    var cookiekeysJson = [{ "key": process.env.cookieEncryptionKey1, "iv": process.env.cookieEncryptionIV1 }];
    cookiekeysJson.push({ "key": process.env.cookieEncryptionKey2, "iv": process.env.cookieEncryptionIV2 });
    //console.log(cookiekeysJson);
    


    var log = bunyan.createLogger({
        name: 'Microsoft OIDC Example Web Application'
    });

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/');
    };

    passport.serializeUser(function (user, done) {
        //console.log('serialize called');
        done(null, user.oid);
    });

    passport.deserializeUser(function (oid, done) {
        //console.log('deserialze called');
        findByOid(oid, function (err, user) {
            done(err, user);
        });
    });

    // array to hold logged in users
    var users = [];

    var findByOid = function (oid, fn) {
        for (var i = 0, len = users.length; i < len; i++) {
            var user = users[i];
            console.log('we are using user: ', user.displayName);
            if (user.oid === oid) {
                return fn(null, user);
            }
        }
        return fn(null, null);
    };
    
    //Setup Passport
    passport.use(new OIDCStrategy({
        identityMetadata: 'https://login.microsoftonline.com/' + process.env.authB2C_Tenant + '/v2.0/.well-known/openid-configuration',
        clientID: process.env.authB2C_APPID,
        responseType: 'code id_token',
        responseMode: 'form_post',
        redirectUrl: process.env.authB2C_redirectURL,
        allowHttpForRedirectUrl: true,
        clientSecret: process.env.authB2C_Secret,
        validateIssuer: true,
        isB2C: true,
        issuer: null,
        passReqToCallback: false,
        scope: ['offline_access'],
        loggingLevel: process.env.loggingLevel,
        nonceLifetime: null,
        nonceMaxAmount: 5,
        useCookieInsteadOfSession: true,
        cookieEncryptionKeys: cookiekeysJson,
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