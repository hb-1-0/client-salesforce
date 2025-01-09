"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesforceClient = void 0;
const axios_1 = __importDefault(require("axios"));
const oauth_1 = require("../auth/oauth");
class SalesforceClient {
    constructor(clientId, clientSecret, username, password) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.username = username;
        this.password = password;
        this.authToken = null;
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.authToken) {
                    this.authToken = yield (0, oauth_1.authenticate)(this.clientId, this.clientSecret, this.username, this.password);
                }
            }
            catch (error) {
                throw new Error(`Authentication failed: ${error.message}`);
            }
        });
    }
    isTokenExpired() {
        if (!this.authToken)
            return true;
        const currentTime = Date.now();
        return (currentTime >=
            this.authToken.created_at + this.authToken.expires_in * 1000);
    }
    refreshAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield axios_1.default.post(url, params);
                this.authToken.access_token = response.data.access_token;
                this.authToken.expires_in = response.data.expires_in;
                this.authToken.created_at = Date.now();
            }
            catch (error) {
                throw new Error(`Failed to refresh access token: ${error.message}`);
            }
        });
    }
    ensureToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.authToken || this.isTokenExpired()) {
                yield this.authenticate();
                if (this.authToken) {
                    yield this.refreshAccessToken();
                }
            }
        });
    }
    query(soql) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                yield this.ensureToken();
                const response = yield axios_1.default.get(`${(_a = this.authToken) === null || _a === void 0 ? void 0 : _a.instance_url}/services/data/vXX.X/query`, {
                    headers: {
                        Authorization: `Bearer ${(_b = this.authToken) === null || _b === void 0 ? void 0 : _b.access_token}`,
                    },
                    params: { q: soql },
                });
                return response.data;
            }
            catch (error) {
                throw new Error(`Query failed: ${error.message}`);
            }
        });
    }
}
exports.SalesforceClient = SalesforceClient;
//# sourceMappingURL=client.js.map