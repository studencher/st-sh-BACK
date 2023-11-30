"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerStateWorker = void 0;
const Constants_1 = require("../helpers/Constants");
const CrawlJob_1 = require("../entities/CrawlJob");
const CrawlersQueues = {
    [Constants_1.Constants.FACEBOOK_CRAWL_JOB_QUEUE]: Constants_1.Constants.FACEBOOK_CRAWL_JOB_QUEUE,
    [Constants_1.Constants.TIKTOK_CRAWL_JOB_QUEUE]: Constants_1.Constants.TIKTOK_CRAWL_JOB_QUEUE,
    [Constants_1.Constants.INSTAGRAM_CRAWL_JOB_QUEUE]: Constants_1.Constants.INSTAGRAM_CRAWL_JOB_QUEUE,
};
class CrawlerStateWorker {
    constructor({ logger, redisClient, crawlerService }) {
        this.getCrawlerState = async (crawlerId) => {
            const data = { hash: `${Constants_1.Constants.CRAWLERS_HASH}:${crawlerId}` };
            const crawlerState = await this.redisClient.getHash(data);
            return {
                crawlerId,
                totalProfilesToSearch: parseInt(crawlerState.totalProfilesToSearch),
                errorsCount: parseInt(crawlerState.errorsCount),
                profilesSearchedOverAll: parseInt(crawlerState.profilesSearchedOverAll),
                isDone: crawlerState.isDone === "true"
            };
        };
        this.getIncrementStateProperty = async ({ crawlerId, property }) => {
            const data = { hash: `${Constants_1.Constants.CRAWLERS_HASH}:${crawlerId}`, property };
            return await this.redisClient.incrementHashProperty(data);
        };
        this.logger = logger;
        this.redisClient = redisClient;
        this.crawlerService = crawlerService;
    }
    async crawlerDoneHandler(crawlerId) {
        const data = { hash: `${Constants_1.Constants.CRAWLERS_HASH}:${crawlerId}`, property: "isDone", value: true };
        await this.redisClient.setHashProperty(data);
    }
    async blockPopCrawlJob(queue) {
        const data = await this.redisClient.pop({ queue, options: { shouldBeBlocked: true } });
        return new CrawlJob_1.CrawlJob(JSON.parse(data));
    }
    async pushCrawlJob(crawlJob) {
        const data = { queue: Constants_1.Constants.FACEBOOK_CRAWL_JOB_QUEUE, message: JSON.stringify(crawlJob) };
        await this.redisClient.push(data);
    }
    async pushManyCrawlJobs({ crawlJobs, queue }) {
        const data = { queue, messages: crawlJobs.map(crawlJob => JSON.stringify(crawlJob)) };
        await this.redisClient.pushMany(data);
    }
    async endCrawlerJob(crawlerId) {
        await this.crawlerService.updateCrawlerStatus({ id: crawlerId, isDone: true });
    }
    async isCrawlerJobDone({ crawlerState, newErrorCounts = 0, newProfilesSearchedOverAll = 0 }) {
        const { totalProfilesToSearch, errorsCount, profilesSearchedOverAll } = crawlerState;
        const sumTotalErrorsCount = errorsCount + newErrorCounts;
        const sumTotalProfilesSearchedOverAll = profilesSearchedOverAll + newProfilesSearchedOverAll;
        return totalProfilesToSearch === sumTotalProfilesSearchedOverAll + sumTotalErrorsCount;
    }
}
exports.CrawlerStateWorker = CrawlerStateWorker;
//# sourceMappingURL=CrawlerStateWorker.js.map