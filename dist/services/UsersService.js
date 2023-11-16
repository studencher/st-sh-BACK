"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UsersService_1 = require("../studentcher-shared-utils/services/UsersService");
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
const RolesRepository_1 = __importDefault(require("../repositories/RolesRepository"));
const CloudService_1 = __importDefault(require("./CloudService"));
exports.default = new UsersService_1.UsersService(UsersRepository_1.default, RolesRepository_1.default, CloudService_1.default);
//# sourceMappingURL=UsersService.js.map