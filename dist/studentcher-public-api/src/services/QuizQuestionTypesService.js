"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuizQuestionTypesService_1 = require("../studentcher-shared-utils/services/QuizQuestionTypesService");
const AuthorizationService_1 = __importDefault(require("./AuthorizationService"));
const QuizQuestionTypesRepository_1 = __importDefault(require("../repositories/QuizQuestionTypesRepository"));
exports.default = new QuizQuestionTypesService_1.QuizQuestionTypesService(AuthorizationService_1.default, QuizQuestionTypesRepository_1.default);
//# sourceMappingURL=QuizQuestionTypesService.js.map