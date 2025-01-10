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
  password: string,
  loginUrl: string,
  grant_type: string
): Promise<AuthResponse> {
  const url = loginUrl;
  const params = new URLSearchParams({
    grant_type: grant_type,
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
