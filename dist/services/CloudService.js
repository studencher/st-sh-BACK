"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CloudService_1 = require("../studentcher-shared-utils/services/CloudService");
const CloudStorageAdapter_1 = __importDefault(require("../storage/CloudStorageAdapter"));
exports.default = new CloudService_1.CloudService(CloudStorageAdapter_1.default);
//# sourceMappingURL=CloudService.js.map