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
    constructor(username, password, clientId, clientSecret, loginUrl, grant_type) {
        this.username = username;
        this.password = password;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.loginUrl = loginUrl;
        this.grant_type = grant_type;
        this.authToken = null;
    }
    authenticate() {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Authenticating...");
                const token = yield (0, oauth_1.authenticate)(this.clientId, this.clientSecret, this.username, this.password, this.loginUrl, this.grant_type);
                if (!(token === null || token === void 0 ? void 0 : token.access_token) || !(token === null || token === void 0 ? void 0 : token.instance_url)) {
                    throw new Error("Invalid authentication response: Missing token data");
                }
                this.authToken = {
                    access_token: token.access_token,
                    instance_url: token.instance_url,
                    expires_in: token.expires_in,
                    created_at: Date.now(),
                };
                console.log("Authentication successful:", this.authToken);
            }
            catch (error) {
                console.error("Authentication Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw {
                    message: ((_d = (_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) ||
                        error.message ||
                        "Authentication failed",
                    errorcode: ((_g = (_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.errorCode) || "AUTHENTICATION_FAILED",
                };
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
    ensureToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.authToken || this.isTokenExpired()) {
                console.log("Token expired or missing. Re-authenticating...");
                yield this.authenticate();
            }
        });
    }
    handleAxiosError(error) {
        console.error("API Error:", error);
        if (axios_1.default.isAxiosError(error) && error.response) {
            const errorData = Array.isArray(error.response.data)
                ? error.response.data[0]
                : error.response.data;
            throw {
                message: (errorData === null || errorData === void 0 ? void 0 : errorData.message) || "An unexpected error occurred.",
                errorcode: (errorData === null || errorData === void 0 ? void 0 : errorData.errorCode) || error.response.status.toString(),
            };
        }
        else {
            throw {
                message: error.message || "An unexpected error occurred.",
                errorcode: "UNKNOWN_ERROR",
            };
        }
    }
    getInstanceUrl() {
        var _a;
        if (!((_a = this.authToken) === null || _a === void 0 ? void 0 : _a.instance_url)) {
            throw new Error("Instance URL is missing from authentication token.");
        }
        return this.authToken.instance_url;
    }
    query(soql) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const instanceUrl = this.getInstanceUrl();
                const response = yield axios_1.default.get(`${instanceUrl}/services/data/v62.0/query`, {
                    headers: { Authorization: `Bearer ${this.authToken.access_token}` },
                    params: { q: soql },
                });
                return response.data;
            }
            catch (error) {
                this.handleAxiosError(error);
            }
        });
    }
    create(objectType, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const instanceUrl = this.getInstanceUrl();
                const response = yield axios_1.default.post(`${instanceUrl}/services/data/v62.0/sobjects/${objectType}`, data, {
                    headers: {
                        Authorization: `Bearer ${this.authToken.access_token}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.data;
            }
            catch (error) {
                this.handleAxiosError(error);
            }
        });
    }
    update(objectType, objectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const instanceUrl = this.getInstanceUrl();
                const response = yield axios_1.default.patch(`${instanceUrl}/services/data/v62.0/sobjects/${objectType}/${objectId}`, data, {
                    headers: {
                        Authorization: `Bearer ${this.authToken.access_token}`,
                        "Content-Type": "application/json",
                    },
                });
                return response.status === 204;
            }
            catch (error) {
                this.handleAxiosError(error);
            }
        });
    }
    delete(objectType, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const instanceUrl = this.getInstanceUrl();
                const response = yield axios_1.default.delete(`${instanceUrl}/services/data/v62.0/sobjects/${objectType}/${objectId}`, {
                    headers: { Authorization: `Bearer ${this.authToken.access_token}` },
                });
                return response.status === 204;
            }
            catch (error) {
                this.handleAxiosError(error);
            }
        });
    }
}
exports.SalesforceClient = SalesforceClient;
//# sourceMappingURL=client.js.map