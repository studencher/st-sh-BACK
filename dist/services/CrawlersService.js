"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CrawlersService_1 = require("../studentcher-shared-utils/services/CrawlersService");
const CrawlersRepository_1 = __importDefault(require("../repositories/CrawlersRepository"));
exports.default = new CrawlersService_1.CrawlersService(CrawlersRepository_1.default);
//# sourceMappingURL=CrawlersService.js.map