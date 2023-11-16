"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuizzesRepository_1 = require("../studentcher-shared-utils/repositories/QuizzesRepository");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
exports.default = new QuizzesRepository_1.QuizzesRepository(postgresAdapter_1.default);
//# sourceMappingURL=QuizzesRepository.js.map