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

var authorityHostUrl = 'https://login.windows.net';
var tenant = 'andrewtestingb2c.onmicrosoft.com'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc'; // Application Id of app registered under AAD.
var clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs='; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.

const userRoutes = (app, fs) => {
   
    // READ
    app.get('/users', (req, res) => {       
        
        //Variables
        var context = new AuthenticationContext(authorityUrl);
        //Temporary varibale used to store the token for debugging
        var tokenstring; 
        // jsonres variable will hold the json respone that comes back from the B2C API
        var jsonres = ' ';
        
        context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function(err, tokenResponse) {
        if (err) {
            console.log('well that didn\'t work: ' + err.stack);
            res.send(err.name);
        } else {
            //Log the token info that was returned to the console
            //console.log(tokenResponse);
            
            //Build the request (URL and Headers including token heard) to send to the API for the request
            const options = {
                url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
                headers: {
                    'User-Agent': 'request',
                    'Authorization': 'Bearer ' + tokenResponse.accessToken
                }
            };
            
            //Call the API
            function callback(error, response, body) {
                if (!error && response.statusCode == 200) {
                jsonres = JSON.parse(body);
                //console.log(jsonres);

                var arrValues = jsonres.value;
                var arrsignInNamres = [];

                for(var i = 0; i < arrValues.length; i++ ){
                    //For Signin Names (some users domt have signinnames)
                    /*if (arrValues[i].signInNames[0]) {
                        arrsignInNamres.push(arrValues[i].signInNames[0].value);
                        console.log(arrsignInNamres[i]);
                    }*/

                    //For display names
                    if (arrValues[i].displayName) {
                        arrsignInNamres.push(arrValues[i].displayName);
                        console.log(arrsignInNamres[i]);
                    }
                }


                //res.send(jsonres.value[1].signInNames[0].value);
                //res.send(arrsignInNamres);
                //res.render('listusers',{names:arrsignInNamres});
                
                //res.send(jsonTemp);
                res.render('userlist.pug',{data:jsonres.value,tenant:tenant})
                }
            }
            
            request(options, callback);
        
        }
        });

        //res.send(tokenstring);
        //res.send(JSON.parse(data));     
    });

    app.get('/users/two', (req, res) => {
            res.send('2');
    });
};

module.exports = userRoutes;