var AuthenticationContext = require('adal-node').AuthenticationContext;
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'andrewtestingb2c.onmicrosoft.com'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc'; // Application Id of app registered under AAD.
var clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs='; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.



const adduserRoutes = (app, fs) => {

    //POST for Create new user
    app.post('/adduser', (req, res) => {
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
                request.post({
                    headers: {
                        'User-Agent': 'request',
                        'Authorization': 'Bearer ' + tokenResponse.accessToken
                    },
                    url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
                    json: userJson
                },

                    function (error, response, body) {
                        if (!error){
                            console.log(body);
                            //res.render('adduser');
                            //var jsonres = ' ';
                            //jsonres = JSON.parse(body)
                            if (body["odata.error"]){
                                res.send(body["odata.error"].message.value);
                            }
                            else{
                                //res.send(body);
                                //console.log('response')
                                res.redirect('/users');
                                
                            }
                        }
                        else{
                            console.log("error happened")
                            console.error('error:', error); // Print the error if one occurred
                            console.log('statusCode:', response && response.statusCode);
                            res.send(error);
                        }
                    });

                //request(options, callback);

            };
        });
    });


    //Get the add New user page
    app.get('/adduser', (req, res) => {
        res.render('adduser.pug')
    });
};

module.exports = adduserRoutes;