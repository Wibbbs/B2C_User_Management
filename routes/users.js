var AuthenticationContext = require('adal-node').AuthenticationContext;
var request = require('request');

jsonTemp = new Object()

jsonTemp = {
    "odata.metadata": "https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/$metadata#directoryObjects",
    "value": [
        {
            "odata.type": "Microsoft.DirectoryServices.User",
            "objectType": "User",
            "objectId": "97977711-fdab-49f8-9f1f-447c99e168d4",
            "deletionTimestamp": null,
            "accountEnabled": true,
            "ageGroup": null,
            "assignedLicenses": [],
            "assignedPlans": [],
            "city": null,
            "companyName": null,
            "consentProvidedForMinor": null,
            "country": null,
            "createdDateTime": "2019-10-23T20:17:28Z",
            "creationType": null,
            "department": null,
            "dirSyncEnabled": null,
            "displayName": "andrew.wiebe@senecacollege.ca",
            "employeeId": null,
            "facsimileTelephoneNumber": null,
            "givenName": "andrew.wiebe@senecacollege.ca",
            "immutableId": null,
            "isCompromised": null,
            "jobTitle": null,
            "lastDirSyncTime": null,
            "legalAgeGroupClassification": null,
            "mail": null,
            "mailNickname": "andrew.wiebe_senecacollege.ca#EXT#",
            "mobile": null,
            "onPremisesDistinguishedName": null,
            "onPremisesSecurityIdentifier": null,
            "otherMails": [
              "andrew.wiebe@senecacollege.ca"
            ],
            "passwordPolicies": null,
            "passwordProfile": null,
            "physicalDeliveryOfficeName": null,
            "postalCode": null,
            "preferredLanguage": null,
            "provisionedPlans": [],
            "provisioningErrors": [],
            "proxyAddresses": [],
            "refreshTokensValidFromDateTime": "2019-10-23T20:17:25Z",
            "showInAddressList": null,
            "signInNames": [],
            "sipProxyAddress": null,
            "state": null,
            "streetAddress": null,
            "surname": "Wiebe",
            "telephoneNumber": null,
            "thumbnailPhoto@odata.mediaEditLink": "directoryObjects/97977711-fdab-49f8-9f1f-447c99e168d4/Microsoft.DirectoryServices.User/thumbnailPhoto",
            "usageLocation": null,
            "userIdentities": [],
            "userPrincipalName": "andrew.wiebe_senecacollege.ca#EXT#@andrewtestingb2c.onmicrosoft.com",
            "userState": null,
            "userStateChangedOn": null,
            "userType": "Member"
          }
    ]
}
 
var authorityHostUrl = 'https://login.windows.net';
var tenant = 'andrewtestingb2c.onmicrosoft.com'; // AAD Tenant name.
var authorityUrl = authorityHostUrl + '/' + tenant;
var applicationId = '9d0673fa-34d6-4124-a5f2-163350e333fc'; // Application Id of app registered under AAD.
var clientSecret = '6rujU/1F/FnjENR1w1s05XWX6a+DdxBFCELsJM3AAWs='; // Secret generated for app. Read this environment variable.
var resource = '00000002-0000-0000-c000-000000000000'; // URI that identifies the resource for which the token is valid.



const userRoutes = (app, fs) => {

    // variables
    const dataPath = './data/users.json';
    var jsonres = ' ';

    // READ
    app.get('/users', (req, res) => {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                throw err;
            }
            var context = new AuthenticationContext(authorityUrl);
            var tokenstring; 
            
            context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function(err, tokenResponse) {
            if (err) {
                console.log('well that didn\'t work: ' + err.stack);
                res.send(err.name);
            } else {
                //console.log(tokenResponse);

                const options = {
                    url: 'https://graph.windows.net/andrewtestingb2c.onmicrosoft.com/users?api-version=1.6',
                    headers: {
                        'User-Agent': 'request',
                        'Authorization': 'Bearer ' + tokenResponse.accessToken
                    }
                };
                
                function callback(error, response, body) {
                    if (!error && response.statusCode == 200) {
                    jsonres = JSON.parse(body);
                    console.log(jsonres);
                    //console.log(info.stargazers_count + " Stars");
                    //console.log(info.forks_count + " Forks");

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
                    res.render('index.pug',{data:jsonres.value})
                    }
                }
                
                request(options, callback);
            
            }
            });

            //res.send(tokenstring);
            //res.send(JSON.parse(data));
        });
    });
};

module.exports = userRoutes;