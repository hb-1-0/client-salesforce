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
    ensureToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.authToken || this.isTokenExpired()) {
                yield this.authenticate();
            }
        });
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
                throw new Error(`Query failed: ${error.message}`);
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
                throw new Error(`Create failed: ${error.message}`);
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
                return response.status === 204; // Salesforce returns 204 for successful updates
            }
            catch (error) {
                throw new Error(`Update failed: ${error.message}`);
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
                return response.status === 204; // Salesforce returns 204 for successful deletions
            }
            catch (error) {
                throw new Error(`Delete failed: ${error.message}`);
            }
        });
    }
}
exports.SalesforceClient = SalesforceClient;
//# sourceMappingURL=client.js.map