export declare class SalesforceClient {
  private username;
  private password;
  private clientId;
  private clientSecret;
  private loginUrl;
  private grant_type;
  private authToken;
  constructor(
    username: string,
    password: string,
    clientId: string,
    clientSecret: string,
    loginUrl: string,
    grant_type: string
  );
  private authenticate;
  private isTokenExpired;
  private ensureToken;
  query(soql: string): Promise<any>;
}
