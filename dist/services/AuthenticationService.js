"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
const AuthenticationService_1 = require("../studentcher-shared-utils/services/AuthenticationService");
exports.default = new AuthenticationService_1.AuthenticationService(postgresAdapter_1.default, Logger_1.default, process.env.JWT_SECRET);
//# sourceMappingURL=AuthenticationService.js.map