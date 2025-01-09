import axios from "axios";
import { authenticate } from "../auth/oauth";

interface AuthToken {
  access_token: string;
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
      const token = await authenticate(
        this.clientId,
        this.clientSecret,
        this.username,
        this.password
      );
      this.authToken = {
        access_token: token.access_token,
        instance_url: token.instance_url,
        expires_in: token.expires_in,
        created_at: Date.now(),
      };
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

  private async ensureToken() {
    if (!this.authToken || this.isTokenExpired()) {
      await this.authenticate();
    }
  }

  public async query(soql: string) {
    try {
      await this.ensureToken();
      const response = await axios.get(
        `${this.authToken?.instance_url}/services/data/v62.0/query`,
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
