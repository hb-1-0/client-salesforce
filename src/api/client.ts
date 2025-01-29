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
    private username: string,
    private password: string,
    private clientId: string,
    private clientSecret: string,
    private loginUrl: string,
    private grant_type: string
  ) {}

  private async authenticate() {
    try {
      const token = await authenticate(
        this.clientId,
        this.clientSecret,
        this.username,
        this.password,
        this.loginUrl,
        this.grant_type
      );
      this.authToken = {
        access_token: token.access_token,
        instance_url: token.instance_url,
        expires_in: token.expires_in,
        created_at: Date.now(),
      };
    } catch (error) {
      console.error(
        "Authentication Error:",
        error.response?.data || error.message
      );
      throw new Error(
        `Authentication failed: ${
          error.response?.data?.message || error.message
        }`
      );
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

  private handleAxiosError(error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response Data:", error.response.data);
      throw new Error(
        `Request failed with status ${error.response.status}: ` +
          `${
            error.response.data.message || JSON.stringify(error.response.data)
          }`
      );
    } else {
      console.error("Unexpected Error:", error);
      throw new Error(`Unexpected error: ${error.message}`);
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
      this.handleAxiosError(error);
    }
  }

  public async create(objectType: string, data: Record<string, any>) {
    try {
      await this.ensureToken();
      const response = await axios.post(
        `${this.authToken?.instance_url}/services/data/v62.0/sobjects/${objectType}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authToken?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  public async update(
    objectType: string,
    objectId: string,
    data: Record<string, any>
  ) {
    try {
      await this.ensureToken();
      const response = await axios.patch(
        `${this.authToken?.instance_url}/services/data/v62.0/sobjects/${objectType}/${objectId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authToken?.access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.status === 204;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  public async delete(objectType: string, objectId: string) {
    try {
      await this.ensureToken();
      const response = await axios.delete(
        `${this.authToken?.instance_url}/services/data/v62.0/sobjects/${objectType}/${objectId}`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken?.access_token}`,
          },
        }
      );
      return response.status === 204;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }
}
