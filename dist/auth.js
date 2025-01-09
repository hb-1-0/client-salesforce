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
exports.authenticate = authenticate;
const axios_1 = __importDefault(require("axios"));
function authenticate(clientId_1, clientSecret_1, username_1, password_1) {
    return __awaiter(this, arguments, void 0, function* (clientId, clientSecret, username, password, loginUrl = "https://login.salesforce.com") {
        const url = `${loginUrl}/services/oauth2/token`;
        const params = new URLSearchParams({
            grant_type: "password",
            client_id: clientId,
            client_secret: clientSecret,
            username,
            password,
        });
        const response = yield axios_1.default.post(url, params);
        return response.data;
    });
}
//# sourceMappingURL=auth.js.map