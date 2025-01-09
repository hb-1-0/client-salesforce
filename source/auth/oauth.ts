// src/auth/oauth.ts
import axios from "axios";

export async function authenticate(
  clientId: string,
  clientSecret: string,
  username: string,
  password: string,
  loginUrl: string = "https://login.salesforce.com"
) {
  const url = `${loginUrl}/services/oauth2/token`;
  const params = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    client_secret: clientSecret,
    username,
    password,
  });

  try {
    const response = await axios.post(url, params);
    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      instance_url: response.data.instance_url,
      expires_in: response.data.expires_in,
      created_at: Date.now(),
    };
  } catch (error) {
    throw new Error("Authentication failed");
  }
}
