declare module "client-salesforce" {
  /**
   * Represents the authentication token details.
   */
  export interface AuthToken {
    access_token: string;
    instance_url: string;
    expires_in: number;
    created_at: number;
  }

  /**
   * Main Salesforce Client class for interacting with Salesforce APIs.
   */
  export class SalesforceClient {
    /**
     * Constructor to initialize the Salesforce client with user credentials.
     * @param clientId - Salesforce client ID.
     * @param clientSecret - Salesforce client secret.
     * @param username - Salesforce username.
     * @param password - Salesforce password.
     */
    constructor(
      clientId: string,
      clientSecret: string,
      username: string,
      password: string
    );

    /**
     * Queries Salesforce using SOQL (Salesforce Object Query Language).
     * @param soql - The SOQL query string.
     * @returns A promise resolving to the query result.
     */
    query(soql: string): Promise<any>;
  }
}
