"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuizQuestionTypesRepository_1 = require("../studentcher-shared-utils/repositories/QuizQuestionTypesRepository");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
exports.default = new QuizQuestionTypesRepository_1.QuizQuestionTypesRepository(postgresAdapter_1.default);
//# sourceMappingURL=QuizQuestionTypesRepository.js.map