"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuizzesService_1 = require("../studentcher-shared-utils/services/QuizzesService");
const AuthorizationService_1 = __importDefault(require("./AuthorizationService"));
const QuizzesRepository_1 = __importDefault(require("../repositories/QuizzesRepository"));
exports.default = new QuizzesService_1.QuizzesService(AuthorizationService_1.default, QuizzesRepository_1.default);
//# sourceMappingURL=QuizzesService.js.map