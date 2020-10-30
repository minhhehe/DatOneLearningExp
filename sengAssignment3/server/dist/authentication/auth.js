"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = void 0;
// import AmazonCognitoIdentity from 'amazon-cognito-identity-js';
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const request_1 = __importDefault(require("request"));
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Authentication {
    constructor() {
        this.poolData = {
            // UserPoolId : "us-east-1_oPzXPpq5y", // Your user pool id here - old one
            // ClientId : "4b2lde31abeobppvfbknmlgajg" // Your client id here - old one
            UserPoolId: "us-east-2_6Ihc4tRmX",
            ClientId: "6tk8ontd5m52ho2jkin5du4njr",
        };
        // readonly PoolRegion: "us-east-2";
        this.AWS_ACCESS_KEY = "AKIAYTW5XENSQAMK43OZ";
        this.AWS_SECRET_ACCESS_KEY = "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";
        this.poolRegion = 'us-east-2';
        this.userPool = new amazon_cognito_identity_js_1.CognitoUserPool(this.poolData);
    }
    setupAWS() {
        aws_sdk_1.default.config.update({ region: this.poolRegion, credentials: new aws_sdk_1.default.Credentials(this.AWS_ACCESS_KEY, this.AWS_SECRET_ACCESS_KEY) });
    }
    RegisterUser(data) {
        const attributeList = [];
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "name", Value: data.name }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "gender", Value: data.gender }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "birthdate", Value: data.birthdate }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "address", Value: data.address }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "email", Value: data.email }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "phone_number", Value: data.phoneNumber }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "custom:isAdmin", Value: "0" }));
        const retVal = new Promise((resolve, reject) => {
            this.userPool.signUp(data.username, data.password, attributeList, null, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                const cognitoUser = result.user;
                console.log('user is ', cognitoUser);
                console.log('user name is ' + cognitoUser.getUsername());
                resolve(result);
            });
        });
        return retVal;
    }
    RegisterUserTemp() {
        const attributeList = [];
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "name", Value: "Minh Chad" }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "gender", Value: "male" }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "birthdate", Value: "1995-08-28" }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "address", Value: "CMB" }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "email", Value: "minhnhb96@gmail.com" }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "phone_number", Value: "+4036076594" }));
        attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({ Name: "custom:isAdmin", Value: "1" }));
        const retVal = new Promise((resolve, reject) => {
            this.userPool.signUp('minhhehe', 'temppassword123', attributeList, null, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                const cognitoUser = result.user;
                console.log('user is ', cognitoUser);
                console.log('user name is ' + cognitoUser.getUsername());
                resolve(result);
            });
        });
        return retVal;
    }
    LoginUser(data) {
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: data.username,
            Password: data.password,
        });
        const userData = {
            Username: data.username,
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess(result) {
                    cognitoUser.getUserData((error, retrievedUserData) => {
                        if (error) {
                            console.log('error', error);
                            reject(error);
                            return;
                        }
                        else {
                            console.log('retrievedUserData', retrievedUserData);
                            resolve({ result, userData: retrievedUserData });
                            return;
                        }
                    });
                },
                onFailure(err) {
                    console.log(err);
                    reject(err);
                },
            });
        });
        return retVal;
    }
    LoginTempUser() {
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: 'minhhehe',
            Password: 'temppassword123',
        });
        const userData = {
            Username: 'minhhehe',
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess(result) {
                    resolve(result);
                },
                onFailure(err) {
                    console.log(err);
                    reject(err);
                },
            });
        });
        return retVal;
    }
    updateUserData(data) {
        const attributeList = [];
        console.log('the data', data);
        for (const property of Object.keys(data.userData)) {
            if (data.userData[property]) {
                attributeList.push(new amazon_cognito_identity_js_1.CognitoUserAttribute({
                    Name: property,
                    Value: data.userData[property]
                }));
            }
        }
        console.log('the attribute list', attributeList);
        const userData = {
            Username: data.user.username,
            Pool: this.userPool
        };
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: data.user.username,
            Password: data.user.password,
        });
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess(result2) {
                    cognitoUser.updateAttributes(attributeList, (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }
                        else {
                            resolve(result);
                            return;
                        }
                    });
                },
                onFailure(err) {
                    console.log(err);
                    reject(err);
                    return;
                },
            });
        });
        return retVal;
    }
    ValidateToken(token) {
        const retVal = new Promise((resolve, reject) => {
            request_1.default({
                url: `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.poolData.UserPoolId}/.well-known/jwks.json`,
                json: true
            }, (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const pems = {};
                    const keys = body.keys;
                    for (const key of keys) {
                        // Convert each key to PEM
                        const keyId = key.kid;
                        const modulus = key.n;
                        const exponent = key.e;
                        const keyType = key.kty;
                        const jwk = { kty: keyType, n: modulus, e: exponent };
                        const pemTemp = jwk_to_pem_1.default(jwk);
                        pems[keyId] = pemTemp;
                    }
                    // validate the token
                    const decodedJwt = jsonwebtoken_1.default.decode(token, { complete: true });
                    if (!decodedJwt) {
                        console.log("Not a valid JWT token");
                        resolve({
                            status: "success",
                            isValid: false,
                            tokenPayLoad: {}
                        });
                        return;
                    }
                    console.log('decodedJwt', decodedJwt);
                    const kid = decodedJwt.header.kid;
                    const pem = pems[kid];
                    if (!pem) {
                        console.log('Invalid token');
                        resolve({
                            status: "success",
                            isValid: false,
                            tokenPayLoad: {}
                        });
                        return;
                    }
                    jsonwebtoken_1.default.verify(token, pem, (err, payload) => {
                        if (err) {
                            console.log("Invalid Token.");
                            resolve({
                                status: "success",
                                isValid: false,
                                tokenPayLoad: {}
                            });
                            return;
                        }
                        else {
                            console.log("Valid Token.");
                            console.log(payload);
                            resolve({
                                status: "success",
                                isValid: true,
                                tokenPayLoad: decodedJwt.payload
                            });
                            return;
                        }
                    });
                }
                else {
                    console.log("Error! Unable to download JWKs");
                    resolve({
                        status: "error",
                        isValid: false,
                        tokenPayLoad: {}
                    });
                    return;
                }
            });
        });
        return retVal;
    }
    renew(data) {
        const RefreshToken = new amazon_cognito_identity_js_1.CognitoRefreshToken({ RefreshToken: data.refreshToken });
        const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(this.poolData);
        const userData = {
            Username: data.username,
            Pool: userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.refreshSession(RefreshToken, (err, session) => {
                if (err) {
                    reject(err);
                    return;
                }
                else {
                    const retObj = {
                        "access_token": session.accessToken.jwtToken,
                        "id_token": session.idToken.jwtToken,
                        "refresh_token": session.refreshToken.token,
                    };
                    resolve(retObj);
                    return;
                }
            });
        });
        return retVal;
    }
    // TODO: Delete a user
    DeleteUser(username, password) {
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: username,
            Password: password,
        });
        const userData = {
            Username: username,
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess(result) {
                cognitoUser.deleteUser((err, deleteResult) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log("Successfully deleted the user.");
                        console.log(deleteResult);
                    }
                });
            },
            onFailure(err) {
                console.log(err);
            },
        });
    }
    // TODO: Delete an attribute from user
    deleteAttributes(username, password) {
        const attributeList = [];
        attributeList.push("custom:scope");
        attributeList.push("name");
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: username,
            Password: password,
        });
        const userData = {
            Username: username,
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        cognitoUser.deleteAttributes(attributeList, (err, result) => {
            if (err) {
                // handle error
            }
            else {
                console.log(result);
            }
        });
    }
    ChangePassword(data) {
        const authenticationDetails = new amazon_cognito_identity_js_1.AuthenticationDetails({
            Username: data.username,
            Password: data.password,
        });
        const userData = {
            Username: data.username,
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess(result) {
                    cognitoUser.changePassword(data.password, data.newpassword, (err, changeresult) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        else {
                            console.log("Successfully changed password of the user.");
                            resolve(changeresult);
                            return;
                        }
                    });
                },
                onFailure(err) {
                    reject(err);
                    return;
                },
            });
        });
        return retVal;
    }
    logUserOut(username) {
        const userData = {
            Username: username,
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        cognitoUser.signOut();
    }
    confirmRegistration(data) {
        const userData = {
            Username: data.username,
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.confirmRegistration(data.confirmationCode, true, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('result ', result);
                resolve(result);
            });
        });
        return retVal;
    }
    confirmTempRegistration() {
        const token = "003830";
        const userData = {
            Username: 'minhhehe',
            Pool: this.userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            cognitoUser.confirmRegistration(token, true, (err, result) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                console.log('result ', result);
                resolve(result);
            });
        });
        return retVal;
    }
    // ########################################## ADMIN FUNCTIONS TO BE USED IN ADMIN ROUTE #######################################################################
    // ################# TO BE IMPLEMENTED LATER #################
    getAllUsers(data) {
        const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(this.poolData);
        const userData = {
            Username: data.username,
            Pool: userPool
        };
        const cognitoUser = new amazon_cognito_identity_js_1.CognitoUser(userData);
        const retVal = new Promise((resolve, reject) => {
            this.setupAWS();
            const cognitoidentityserviceprovider = new aws_sdk_1.default.CognitoIdentityServiceProvider();
            const params = {
                UserPoolId: this.poolData.UserPoolId,
                AttributesToGet: [
                    'email',
                ],
            };
            cognitoidentityserviceprovider.listUsers(params, (err, listdata) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    console.log("data", listdata);
                    resolve(listdata);
                }
            });
        });
        return retVal;
    }
}
exports.Authentication = Authentication;
//# sourceMappingURL=auth.js.map