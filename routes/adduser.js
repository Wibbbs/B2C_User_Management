var AuthenticationContext = require('adal-node').AuthenticationContext;


var authorityHostUrl = 'https://login.windows.net';
var tenant = 'andrewtestingb2c.onmicrosoft.com'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc'; // Application Id of app registered under AAD.
var clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs='; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.



const userRoutes = (app, fs) => {



    // READ
    app.get('/adduser', (req, res) => {
        var context = new AuthenticationContext(authorityUrl);
        var tokenstring;

        context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) {
            if (err) {
                console.log('well that didn\'t work: ' + err.stack);
                res.send(err.name);
            } else {
                console.log(tokenResponse);

                /*const options = {
                    url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
                    headers: {
                        'User-Agent': 'request',
                        'Authorization': 'Bearer ' + tokenResponse.accessToken
                    },
                    
                };*/

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
                                "type": "userName",
                                "value": "EileenWan"
                            }
                        ],
                        "creationType": "LocalAccount",
                        "displayName": "Joe Consumer",
                        "mailNickname": "eileenw",
                        "passwordProfile": {
                            "password": "P@ssword!",
                            "forceChangePasswordNextLogin": false
                        },
                        "passwordPolicies": "DisablePasswordExpiration",


                        "city": "Toronto",
                        "country": null,
                        "facsimileTelephoneNumber": null,
                        "givenName": "Joe",
                        "mail": null,
                        "mobile": null,
                        "otherMails": [],
                        "postalCode": "92130",
                        "preferredLanguage": null,
                        "state": "California",
                        "streetAddress": null,
                        "surname": "Consumer",
                        "telephoneNumber": null
                    }
                }, function (error, response, body) {
                    console.log(body);
                    res.send(body);
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
                */
            }
        });

        //res.send(tokenstring);
        //res.send(JSON.parse(data));
    });
};

module.exports = userRoutes;