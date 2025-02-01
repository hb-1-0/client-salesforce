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
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield (0, oauth_1.authenticate)(this.clientId, this.clientSecret, this.username, this.password, this.loginUrl, this.grant_type);
                this.authToken = {
                    access_token: token.access_token,
                    instance_url: token.instance_url,
                    expires_in: token.expires_in,
                    created_at: Date.now(),
                };
            }
            catch (error) {
                console.error("Authentication Error:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw {
                    message: ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data[0]) === null || _c === void 0 ? void 0 : _c.message) || error.message,
                    errorcode: ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data[0]) === null || _e === void 0 ? void 0 : _e.errorCode) || "AUTHENTICATION_FAILED",
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
                yield this.authenticate();
            }
        });
    }
    handleAxiosError(error) {
        if (axios_1.default.isAxiosError(error) && error.response) {
            const errorData = error.response.data[0];
            const message = (errorData === null || errorData === void 0 ? void 0 : errorData.message) || "An unexpected error occurred.";
            const errorCode = (errorData === null || errorData === void 0 ? void 0 : errorData.errorCode) || error.response.status.toString();
            console.error("Error Response Data:", error.response.data);
            throw {
                message,
                errorcode: errorCode,
            };
        }
        else {
            console.error("Unexpected Error:", error);
            throw {
                message: error.message || "An unexpected error occurred.",
                errorcode: "UNKNOWN_ERROR",
            };
        }
    }
    query(soql) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const response = yield axios_1.default.get(`${(_a = this.authToken) === null || _a === void 0 ? void 0 : _a.instance_url}/services/data/v62.0/query`, {
                    headers: {
                        Authorization: `Bearer ${(_b = this.authToken) === null || _b === void 0 ? void 0 : _b.access_token}`,
                    },
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const response = yield axios_1.default.post(`${(_a = this.authToken) === null || _a === void 0 ? void 0 : _a.instance_url}/services/data/v62.0/sobjects/${objectType}`, data, {
                    headers: {
                        Authorization: `Bearer ${(_b = this.authToken) === null || _b === void 0 ? void 0 : _b.access_token}`,
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const response = yield axios_1.default.patch(`${(_a = this.authToken) === null || _a === void 0 ? void 0 : _a.instance_url}/services/data/v62.0/sobjects/${objectType}/${objectId}`, data, {
                    headers: {
                        Authorization: `Bearer ${(_b = this.authToken) === null || _b === void 0 ? void 0 : _b.access_token}`,
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
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ensureToken();
                const response = yield axios_1.default.delete(`${(_a = this.authToken) === null || _a === void 0 ? void 0 : _a.instance_url}/services/data/v62.0/sobjects/${objectType}/${objectId}`, {
                    headers: {
                        Authorization: `Bearer ${(_b = this.authToken) === null || _b === void 0 ? void 0 : _b.access_token}`,
                    },
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