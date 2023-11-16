"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
const CrawlersRepository_1 = require("../studentcher-shared-utils/repositories/CrawlersRepository/CrawlersRepository");
exports.default = new CrawlersRepository_1.CrawlersRepository(postgresAdapter_1.default);
//# sourceMappingURL=CrawlersRepository.js.map