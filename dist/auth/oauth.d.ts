interface AuthResponse {
    access_token: string;
    instance_url: string;
    expires_in: number;
}
export declare function authenticate(clientId: string, clientSecret: string, username: string, password: string, loginUrl: string, grant_type: string): Promise<AuthResponse>;
export {};
