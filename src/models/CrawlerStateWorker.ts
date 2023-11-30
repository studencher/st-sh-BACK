import {Logger} from "../studentcher-shared-utils/helpers/Logger";
import {CrawlerStateWorker} from "../studentcher-shared-utils/models/CrawlerStateWorker";
import redisAdapter from "../helpers/RedisAdapter";
import crawlerService from "../services/CrawlersService";

export default new CrawlerStateWorker({
    logger: new Logger("CrawlerStateWorker"),
    redisClient: redisAdapter,
    crawlerService
});


// hi!