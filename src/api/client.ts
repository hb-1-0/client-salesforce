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

      if (!token?.access_token || !token?.instance_url) {
        throw new Error("Invalid authentication response: Missing token data");
      }

      this.authToken = {
        access_token: token.access_token,
        instance_url: token.instance_url,
        expires_in: token.expires_in,
        created_at: Date.now(),
      };
    } catch (error: any) {
      console.error(
        "Authentication Error:",
        error.response?.data || error.message
      );

      throw {
        message:
          error.response?.data?.[0]?.message ||
          error.message ||
          "Authentication failed",
        errorcode:
          error.response?.data?.[0]?.errorCode || "AUTHENTICATION_FAILED",
      };
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
    console.error("API Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      const errorData = Array.isArray(error.response.data)
        ? error.response.data[0]
        : error.response.data;

      throw {
        message: errorData?.message || "An unexpected error occurred.",
        errorcode: errorData?.errorCode || error.response.status.toString(),
      };
    } else {
      throw {
        message: error.message || "An unexpected error occurred.",
        errorcode: "UNKNOWN_ERROR",
      };
    }
  }

  private getInstanceUrl(): string {
    if (!this.authToken?.instance_url) {
      throw new Error("Instance URL is missing from authentication token.");
    }
    return this.authToken.instance_url;
  }

  public async query(soql: string) {
    try {
      await this.ensureToken();
      const instanceUrl = this.getInstanceUrl();

      const response = await axios.get(
        `${instanceUrl}/services/data/v62.0/query`,
        {
          headers: { Authorization: `Bearer ${this.authToken!.access_token}` },
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
      const instanceUrl = this.getInstanceUrl();

      const response = await axios.post(
        `${instanceUrl}/services/data/v62.0/sobjects/${objectType}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authToken!.access_token}`,
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
      const instanceUrl = this.getInstanceUrl();

      const response = await axios.patch(
        `${instanceUrl}/services/data/v62.0/sobjects/${objectType}/${objectId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authToken!.access_token}`,
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
      const instanceUrl = this.getInstanceUrl();

      const response = await axios.delete(
        `${instanceUrl}/services/data/v62.0/sobjects/${objectType}/${objectId}`,
        {
          headers: { Authorization: `Bearer ${this.authToken!.access_token}` },
        }
      );

      return response.status === 204;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }
}
