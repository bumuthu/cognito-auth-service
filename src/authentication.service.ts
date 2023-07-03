import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';


const noUserSessionFound = { code:"NoUserSessionFoundInBrowser", message: "No user has logged in recently from this browser" };

export class AuthenticationService {

    private userPool: CognitoUserPool;
    private cognitoUser: CognitoUser | null;

    constructor(poolId: string, clientId: string) {
        this.userPool = new CognitoUserPool({
            UserPoolId: poolId,
            ClientId: clientId,
        });
        this.cognitoUser = this.userPool.getCurrentUser();
    }


    async signUp(email: string, password: string, userId: string) {
        console.log('email=' + email + ', password=' + password + ', userId=' + userId)

        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        const userIdAttr = new CognitoUserAttribute({
            Name: 'custom:user_id',
            Value: userId
        })

        return new Promise(
            (resolve, reject) => {
                this.userPool.signUp(
                    email,
                    password,
                    [userIdAttr],
                    null,
                    function (error, response) {
                        if (error) reject(error);
                        resolve(response);
                    }
                )
            }
        );
    }


    async signIn(email: string, password: string): Promise<{ accessToken: string, idToken: string, refreshToken: string }> {
        console.log('sign-in: email=' + email + ', password=' + password);

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password
        });
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        return new Promise(
            (resolve, reject) => {
                this.cognitoUser.authenticateUser(authenticationDetails, {
                    onSuccess: function (result) {
                        const accessToken: string = result.getAccessToken().getJwtToken();
                        const idToken: string = result.getIdToken().getJwtToken();
                        const refreshToken: string = result.getRefreshToken().getToken();
                        resolve({ accessToken, idToken, refreshToken })
                    },
                    onFailure: function (err) {
                        reject(err)
                    }
                });
            })
    }


    async signOut() {
        console.log('sign-out request');

        return new Promise(
            (resolve, reject) => {
                if (this.cognitoUser == null) { reject(noUserSessionFound) }

                this.cognitoUser.signOut(() => {
                    return resolve("DONE");
                });
            });
    }


    async verifyUser(email: string, code: string) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        return new Promise(
            (resolve, reject) => {
                this.cognitoUser.confirmRegistration(
                    code, true, (err, result) => {
                        if (err) return reject(err);
                        return resolve(result);
                    });
            })
    }


    async resendVerification(email: string) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        return new Promise(
            (resolve, reject) => {
                this.cognitoUser.resendConfirmationCode(
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve(result);
                    });
            })
    }


    async forgotPassword(email: string) {
        this.cognitoUser = new CognitoUser({
            Username: email,
            Pool: this.userPool
        });

        return new Promise(
            (resolve, reject) => {
                this.cognitoUser.forgotPassword(
                    {
                        onSuccess: function (result) {
                            resolve(result)
                        },
                        onFailure: function (err) {
                            reject(err)
                        }
                    })
            })
    }


    async confirmPassword(verificationCode: string, newPassword: string) {
        return new Promise(
            (resolve, reject) => {
                if (this.cognitoUser == null) { reject(noUserSessionFound) }

                this.cognitoUser.confirmPassword(verificationCode, newPassword, {
                    onSuccess: function (result) {
                        resolve(result)
                    },
                    onFailure: function (err) {
                        reject(err)
                    }
                })
            });
    }


    async changePassword(oldPassword: string, newPassword: string) {
        return new Promise(
            (resolve, reject) => {
                if (this.cognitoUser == null) { reject(noUserSessionFound) }

                this.cognitoUser.changePassword(
                    oldPassword,
                    newPassword,
                    (err, result) => {
                        if (err) return reject(err);
                        return resolve(result);
                    });
            })
    }


    async deleteUser() {
        await new Promise(
            (resolve, reject) => {
                if (this.cognitoUser == null) { reject(noUserSessionFound) }

                this.cognitoUser.deleteUser((err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve("DELETED");
                });
            }
        );
    }


    async getAccessToken() {
        await new Promise(
            (resolve, reject) => {
                if (this.cognitoUser == null) { reject(noUserSessionFound) }

                this.cognitoUser.getSession(
                    (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            const cognitoUserSession = data;
                            const idToken = cognitoUserSession.getIdToken().jwtToken;
                            const accessToken = cognitoUserSession.getAccessToken().jwtToken;
                            resolve({
                                idToken,
                                accessToken
                            });
                        }
                    }
                );
            }
        );
    }
}
