var AuthenticationContext = require('adal-node').AuthenticationContext;
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'andrewtestingb2c.onmicrosoft.com'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc'; // Application Id of app registered under AAD.
var clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs='; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.



const userRoutes = (app, fs) => {

    app.post('/adduser', (req, res) => {
        var context = new AuthenticationContext(authorityUrl);

        context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) {
            if (err) {
                console.log('well that didn\'t work: ' + err.stack);
                res.send(err.name);
            } else {
                //console.log(tokenResponse);

                var resetPass

                if (req.body.resetPass) {
                    resetPass = "true"
                } else {
                    resetPass = "false"
                }

                var userJson = { "accountEnabled": true };
                userJson.signInNames = [{ "type": "emailaddress", "value": req.body.email }]
                userJson.displayName = req.body.displayName;
                userJson.passwordProfile = { "password": req.body.password, forceChangePasswordNextLogin: "false" };
                userJson.passwordPolicies = "DisablePasswordExpiration";
                
                console.log(' ');
                console.log(' ');
                console.log(userJson);
                console.log(' ');
                console.log(' ');

                var request = require('request');
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
                                res.redirect('/users');
                                
                            }

                            
                            //res.send(body["odata.error"].message.value);

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


    // READ
    app.get('/adduser', (req, res) => {
        // var context = new AuthenticationContext(authorityUrl);
        //var tokenstring;

        res.render('adduser.pug')

        /* context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) {
             if (err) {
                 console.log('well that didn\'t work: ' + err.stack);
                 res.send(err.name);
             } else {
                 console.log(tokenResponse);

                 //const options = {
                 //    url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
                 //    headers: {
                 //      'User-Agent': 'request',
                 //        'Authorization': 'Bearer ' + tokenResponse.accessToken
                 //    },
                 //    
                 //};



                 var request = require('request');
                 request.post({
                     headers: {
                         'User-Agent': 'request',
                         'Authorization': 'Bearer ' + tokenResponse.accessToken
                     },
                     url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
                     json: {
                         "accountEnabled": true,
                         "signInNames": [
                             {
                                 "type": "emailaddress",
                                 "value": "HardCodedUser2@nodeapp.com"
                             }
                         ],
                         "displayName": "Eillen Wan",
                         "passwordProfile": {
                             "password": "P@ssword!",
                             "forceChangePasswordNextLogin": true
                         }

                     }
                 },

                     function (error, response, body) {
                         console.log(body);
                         res.render('adduser');
                     });

                 //res.send(body);

                 /*
                 function callback(error, response, body) {
                     if (!error && response.statusCode == 200) {
                         jsonres = JSON.parse(body);
                         console.log(jsonres);
                         //console.log(info.stargazers_count + " Stars");
                         //console.log(info.forks_count + " Forks");
 
                         var arrValues = jsonres.value;
                         var arrsignInNamres = [];
                              
                         res.render('index', { names: arrsignInNamres });
 
                     }
                 }
                 
 
                 request(options, callback);
                 
             }
         });*/

        //res.send(tokenstring);
        //res.send(JSON.parse(data));
    });
};

module.exports = userRoutes;