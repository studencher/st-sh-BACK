"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../studentcher-shared-utils/helpers/Logger");
const CrawlerStateWorker_1 = require("../studentcher-shared-utils/models/CrawlerStateWorker");
const RedisAdapter_1 = __importDefault(require("../helpers/RedisAdapter"));
const CrawlersService_1 = __importDefault(require("../services/CrawlersService"));
exports.default = new CrawlerStateWorker_1.CrawlerStateWorker({
    logger: new Logger_1.Logger("CrawlerStateWorker"),
    redisClient: RedisAdapter_1.default,
    crawlerService: CrawlersService_1.default
});
//# sourceMappingURL=CrawlerStateWorker.js.map