interface AuthResponse {
  access_token: string;
  instance_url: string;
  expires_in: number;
}
export declare function authenticate(
  username: string,
  password: string,
  clientId: string,
  clientSecret: string,
  loginUrl: string,
  grant_type: string
): Promise<AuthResponse>;
export {};
