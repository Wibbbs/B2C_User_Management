var AuthenticationContext = require('adal-node').AuthenticationContext;
var request = require('request');

//This creates a temporary JSON object containing new USER data that was only used for testing/debugging.
/*jsonTemp = new Object()
jsonTemp = {
    "odata.metadata": "https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/$metadata#directoryObjects",
    "value": [
        {
            "odata.type": "Microsoft.DirectoryServices.User",
            "objectType": "User",
            "objectId": "f1936d29-4fb2-4a77-95f6-650c17af3fc8",
            "deletionTimestamp": null,
            "accountEnabled": true,
            "ageGroup": null,
            "assignedLicenses": [],
            "assignedPlans": [],
            "city": null,
            "companyName": null,
            "consentProvidedForMinor": null,
            "country": null,
            "createdDateTime": "2019-10-26T22:54:25Z",
            "creationType": "LocalAccount",
            "department": null,
            "dirSyncEnabled": null,
            "displayName": "Eillen Wan",
            "employeeId": null,
            "facsimileTelephoneNumber": null,
            "givenName": null,
            "immutableId": null,
            "isCompromised": null,
            "jobTitle": null,
            "lastDirSyncTime": null,
            "legalAgeGroupClassification": null,
            "mail": null,
            "mailNickname": "f1936d29-4fb2-4a77-95f6-650c17af3fc8",
            "mobile": null,
            "onPremisesDistinguishedName": null,
            "onPremisesSecurityIdentifier": null,
            "otherMails": [],
            "passwordPolicies": null,
            "passwordProfile": {
              "password": null,
              "forceChangePasswordNextLogin": true,
              "enforceChangePasswordPolicy": false
            },
            "physicalDeliveryOfficeName": null,
            "postalCode": null,
            "preferredLanguage": null,
            "provisionedPlans": [],
            "provisioningErrors": [],
            "proxyAddresses": [],
            "refreshTokensValidFromDateTime": "2019-10-26T22:54:24Z",
            "showInAddressList": null,
            "signInNames": [
                {
                  "type": "emailaddress",
                  "value": "HardCodedUser2@nodeapp.com"
                }
              ],
            "sipProxyAddress": null,
            "state": null,
            "streetAddress": null,
            "surname": null,
            "telephoneNumber": null,
            "thumbnailPhoto@odata.mediaEditLink": "directoryObjects/f1936d29-4fb2-4a77-95f6-650c17af3fc8/Microsoft.DirectoryServices.User/thumbnailPhoto",
            "usageLocation": null,
            "userIdentities": [],
            "userPrincipalName": "f1936d29-4fb2-4a77-95f6-650c17af3fc8@andrewtestingb2c.onmicrosoft.com",
            "userState": null,
            "userStateChangedOn": null,
            "userType": "Member"
          }
    ]
}*/

/* Moved into the route to update dyamically
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'andrewtestingb2c.onmicrosoft.com'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc'; // Application Id of app registered under AAD.
var clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs='; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.*/

const userRoutes = (app, fs) => {

    // READ
    app.get('/users', (req, res) => {

        if (req.isAuthenticated()) {

            var tenant = ' '; // AAD Tenant name.
            var authorityHostUrl = 'https://login.windows.net';
            var authorityUrl = ' ';
            var applicationId = ' '; // Application Id of app registered under AAD.
            var clientSecret = ' '; // Secret generated for app. Read this environment variable.
            var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.

            if (!req.query.tenant) {
                res.render('userlist.pug')
                return 0;
            }
            else if (req.query.tenant == 'andrewtestingb2c') {
                tenant = 'andrewtestingb2c.onmicrosoft.com';
                authorityUrl = authorityHostUrl + '/' + tenant;
                applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc';
                clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs=';
            }
            else if (req.query.tenant == 'IAPSBXB2C') {
                tenant = 'IAPSBXB2C.onmicrosoft.com';
                authorityUrl = authorityHostUrl + '/' + tenant;
            }
            else if (req.query.tenant == 'IAPDEVB2C') {
                tenant = 'IAPDEVB2C.onmicrosoft.com';
                authorityUrl = authorityHostUrl + '/' + tenant;
            }
            else {
                res.send('Error This is not a valid B2C tenant.');
                authorityUrl = authorityHostUrl + '/' + tenant;
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
                    res.send(err.name);
                } else {

                    //console.log(tokenResponse);

                    //Build the request (URL and Headers including token header) to send to the API for the request
                    const options = {
                        url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
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
            res.redirect('/');
        }
    });

};

module.exports = userRoutes;