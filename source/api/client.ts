import axios from "axios";
import { authenticate } from "../auth/oauth";

interface AuthToken {
  access_token: string;
  refresh_token: string;
  instance_url: string;
  expires_in: number;
  created_at: number;
}

export class SalesforceClient {
  private authToken: AuthToken | null = null;

  constructor(
    private clientId: string,
    private clientSecret: string,
    private username: string,
    private password: string
  ) {}

  private async authenticate() {
    try {
      if (!this.authToken) {
        this.authToken = await authenticate(
          this.clientId,
          this.clientSecret,
          this.username,
          this.password
        );
      }
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  private isTokenExpired(): boolean {
    if (!this.authToken) return true;
    const currentTime = Date.now();
    return (
      currentTime >=
      this.authToken.created_at + this.authToken.expires_in * 1000
    );
  }

  private async refreshAccessToken() {
    if (!this.authToken) {
      throw new Error("No authentication token available.");
    }

    const url = `${this.authToken.instance_url}/services/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.authToken.refresh_token,
    });

    try {
      const response = await axios.post(url, params);
      this.authToken.access_token = response.data.access_token;
      this.authToken.expires_in = response.data.expires_in;
      this.authToken.created_at = Date.now();
    } catch (error) {
      throw new Error(`Failed to refresh access token: ${error.message}`);
    }
  }

  private async ensureToken() {
    if (!this.authToken || this.isTokenExpired()) {
      await this.authenticate();
      if (this.authToken) {
        await this.refreshAccessToken();
      }
    }
  }

  public async query(soql: string) {
    try {
      await this.ensureToken();
      const response = await axios.get(
        `${this.authToken?.instance_url}/services/data/vXX.X/query`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken?.access_token}`,
          },
          params: { q: soql },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }
}
