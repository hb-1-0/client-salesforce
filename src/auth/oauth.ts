import axios from "axios";

interface AuthResponse {
  access_token: string;
  instance_url: string;
  expires_in: number;
}

export async function authenticate(
  clientId: string,
  clientSecret: string,
  username: string,
  password: string
): Promise<AuthResponse> {
  const url = "https://login.salesforce.com/services/oauth2/token";
  const params = new URLSearchParams({
    grant_type: "password",
    client_id: clientId,
    client_secret: clientSecret,
    username: username,
    password: password,
  });

  try {
    const response = await axios.post(url, params);
    const { access_token, instance_url, expires_in } = response.data;
    return {
      access_token,
      instance_url,
      expires_in,
    };
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
}
