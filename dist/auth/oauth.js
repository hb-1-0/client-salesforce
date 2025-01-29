"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const axios_1 = __importDefault(require("axios"));
function authenticate(
  clientId,
  clientSecret,
  username,
  password,
  loginUrl,
  grant_type
) {
  return __awaiter(this, void 0, void 0, function* () {
    const url = loginUrl;
    const params = new URLSearchParams({
      grant_type: grant_type,
      client_id: clientId,
      client_secret: clientSecret,
      username: username,
      password: password,
    });
    try {
      const response = yield axios_1.default.post(url, params);
      const { access_token, instance_url, expires_in } = response.data;
      return {
        access_token,
        instance_url,
        expires_in,
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  });
}
exports.authenticate = authenticate;
//# sourceMappingURL=oauth.js.map
