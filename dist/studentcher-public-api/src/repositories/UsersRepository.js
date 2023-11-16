"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UsersRepository_1 = require("../studentcher-shared-utils/repositories/UsersRepository");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
exports.default = new UsersRepository_1.UsersRepository(postgresAdapter_1.default);
//# sourceMappingURL=UsersRepository.js.map