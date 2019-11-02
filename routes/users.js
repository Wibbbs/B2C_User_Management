var AuthenticationContext = require('adal-node').AuthenticationContext;
var request = require('request');

const userRoutes = (app, fs) => {

    // READ
    app.get('/users', (req, res) => {

        if (req.isAuthenticated()) {

            var tenant = ' ';
            var authorityHostUrl = 'https://login.windows.net';
            var authorityUrl = ' ';
            var applicationId = ' ';
            var clientSecret = ' ';
            var resource = '00000002-0000-0000-c000-000000000000';

            if (!req.query.tenant) {
                res.render('userlist.pug')
                return 0;
            }
            else if (req.query.tenant == 'AAD_1') {
                tenant = process.env.AAD_1_tenant;
                authorityUrl = authorityHostUrl + '/' + tenant;
                applicationId = process.env.AAD_1_applicationId;
                clientSecret = process.env.AAD_1_clientSecret;
            }
            else if (req.query.tenant == 'AAD_2') {
                tenant = process.env.AAD_2_tenant;
                authorityUrl = authorityHostUrl + '/' + tenant;
                applicationId = process.env.AAD_2_applicationId;
                clientSecret = process.env.AAD_2_clientSecret;
            }
            else if (req.query.tenant == 'AAD_3') {
                tenant = process.env.AAD_3_tenant;
                authorityUrl = authorityHostUrl + '/' + tenant;
                applicationId = process.env.AAD_3_applicationId;
                clientSecret = process.env.AAD_3_clientSecret;
            }
            else if (req.query.tenant == 'AAD_4') {
                tenant = process.env.AAD_4_tenant;
                authorityUrl = authorityHostUrl + '/' + tenant;
                applicationId = process.env.AAD_4_applicationId;
                clientSecret = process.env.AAD_4_clientSecret;
            }
            else {
                res.render('error.pug',{error: 'Error This is not a valid B2C tenant.'});
                return 0;
            }

            //Variables
            var context = new AuthenticationContext(authorityUrl);
            //Temporary varibale used to store the token for debugging
            var tokenstring;
            // jsonres variable will hold the json respone that comes back from the B2C API
            var jsonres = ' ';

            //Get Token from B2C
            context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) {
                if (err) {
                    console.log('Could Not Aquire Token' + err.stack);
                    res.render('error.pug');
                } else {

                    //console.log(tokenResponse);

                    //Build the request (URL and Headers including token header) to send to the API for the request
                    const options = {
                        url: 'https://graph.windows.net/' + tenant + '/users?api-version=1.6',
                        headers: {
                            'User-Agent': 'request',
                            'Authorization': 'Bearer ' + tokenResponse.accessToken
                        }
                    };

                    //Call the API
                    //This is the callback function that will be called after the 
                    //request(options,callback) function below is complete.
                    function callback(error, response, body) {
                        if (!error && response.statusCode == 200) {
                            jsonres = JSON.parse(body);
                            //console.log(jsonres);

                            /*This block was when I was playing around with arrays
                            var arrValues = jsonres.value;
                            var arrsignInNamres = [];
                            for(var i = 0; i < arrValues.length; i++ ){
                                //For Signin Names (some users domt have signinnames)
                                /*if (arrValues[i].signInNames[0]) {
                                    arrsignInNamres.push(arrValues[i].signInNames[0].value);
                                    console.log(arrsignInNamres[i]);
                                }
                                //For display names
                                if (arrValues[i].displayName) {
                                    arrsignInNamres.push(arrValues[i].displayName);
                                    console.log(arrsignInNamres[i]);
                                }
                            }*/

                            //console.log(jsonres.value[1].signInNames[0].value);
                            //console.log(arrsignInNamres);

                            //res.send(jsonTemp);
                            res.render('userlist.pug', { data: jsonres.value, tenant: tenant })
                        }
                    }
                    request(options, callback);
                }
            });
            //res.send(tokenstring);
            //res.send(JSON.parse(data));   
        }
        else{
            //If not authenticated
            res.redirect('/');
        }
    });

};

module.exports = userRoutes;