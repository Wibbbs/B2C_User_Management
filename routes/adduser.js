var AuthenticationContext = require('adal-node').AuthenticationContext;
var authorityHostUrl = 'https://login.windows.net';
var tenant = process.env.AAD_1_tenant; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + process.env.AAD_1_tenant;
var applicationId = process.env.AAD_1_applicationId; // Application Id of app registered under AAD.
var clientSecret = process.env.AAD_1_clientSecret; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.

const adduserRoutes = (app, fs) => {

    //POST for Create new user
    app.post('/adduser', function (req, res) {
        if (req.isAuthenticated()) {
            var context = new AuthenticationContext(authorityUrl);

            //Try to get a token from the B2C
            context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) {
                if (err) {
                    console.log('well that didn\'t work: ' + err.stack);
                    res.send(err.name);
                } else {
                    //console.log(tokenResponse);

                    //Build the json object using data from user input form
                    var userJson = { "accountEnabled": true };
                    userJson.signInNames = [{ "type": "emailaddress", "value": req.body.email }]
                    userJson.displayName = req.body.displayName;
                    userJson.passwordProfile = { "password": req.body.password, forceChangePasswordNextLogin: "false" };
                    userJson.passwordPolicies = "DisablePasswordExpiration";

                    //console.log(userJson);

                    //Instantiate Request Module
                    var request = require('request');

                    //Build the API request object with the URL and json object and token header and send post.
                    request.post({ //(options,callback)
                        //options for the api call
                        headers: {
                            'User-Agent': 'request',
                            'Authorization': 'Bearer ' + tokenResponse.accessToken
                        },
                        url: 'https://graph.windows.net/' + tenant + '/users?api-version=1.6',
                        json: userJson
                    },

                        // callback funtion that is called after the API request is done
                        function (error, response, body) {
                            if (!error) {
                                console.log(body);
                                //res.render('adduser');
                                //var jsonres = ' ';
                                //jsonres = JSON.parse(body)
                                if (body["odata.error"]) {
                                    res.send(body["odata.error"].message.value);
                                }
                                else {
                                    //res.send(body);
                                    //console.log('response')
                                    res.redirect('/users?tenant=AAD_1');

                                }
                            }
                            else {
                                console.log("error happened")
                                console.error('error:', error); // Print the error if one occurred
                                console.log('statusCode:', response && response.statusCode);
                                res.send(error);
                            }
                        });
                };
            });
        }
        else {
            res.redirect('/');
        }
    });


    //Get the add New user page
    app.get('/adduser', (req, res) => {
        if (req.isAuthenticated()) {
            res.render('adduser.pug')
        }
        else {
            res.redirect('/');
        }

    });
};

module.exports = adduserRoutes;