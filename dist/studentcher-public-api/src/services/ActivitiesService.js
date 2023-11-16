"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActivitiesService_1 = require("../studentcher-shared-utils/services/ActivitiesService");
const ActivitiesRepository_1 = __importDefault(require("../repositories/ActivitiesRepository"));
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
const RolesRepository_1 = __importDefault(require("../repositories/RolesRepository"));
const AuthorizationService_1 = __importDefault(require("./AuthorizationService"));
exports.default = new ActivitiesService_1.ActivitiesService(AuthorizationService_1.default, ActivitiesRepository_1.default, UsersRepository_1.default, RolesRepository_1.default);
//# sourceMappingURL=ActivitiesService.js.map