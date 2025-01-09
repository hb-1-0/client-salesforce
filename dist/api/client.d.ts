export declare class SalesforceClient {
    private clientId;
    private clientSecret;
    private username;
    private password;
    private authToken;
    constructor(clientId: string, clientSecret: string, username: string, password: string);
    private authenticate;
    private isTokenExpired;
    private ensureToken;
    query(soql: string): Promise<any>;
}
