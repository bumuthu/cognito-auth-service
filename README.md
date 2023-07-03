## Cognito Authentication Service
*A wrapper NodeJs library for AWS Cognito Authentications*

AWS Cognito is a user management and authentication service provided by Amazon Web Services. It helps developers easily add sign-up, sign-in, and access control to their web and mobile apps. With AWS Cognito, developers can focus on building their apps while leaving the user management tasks to the service.


In this repository, I provide an authentication service that can be used in NodeJS to perform authentication actions such as sign-in, sign-up, user deletion, etc.

```
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
```


In this [article](https://medium.com/@bumuthu.dilshan/aws-cognito-with-3d6e938fc110), we have discussed how to template cognito provisioning with SAM.

A GitHub workflow is also added to the repository in order to publish the library with your own customizations to a private registry. Replace `@your_registry_name` with your registry name in `package.json` and `workflows/npm-publish-github-packages.yml` files.

Happy Coding!


