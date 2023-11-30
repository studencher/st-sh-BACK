"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActivitiesRepository_1 = require("../studentcher-shared-utils/repositories/ActivitiesRepository");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
exports.default = new ActivitiesRepository_1.ActivitiesRepository(postgresAdapter_1.default);
//# sourceMappingURL=ActivitiesRepository.js.map