import {Constants} from "../helpers/Constants";
import {RedisAdapter} from "../storage/RedisAdapter";
import {Logger} from "../helpers/Logger";
import {CrawlJob, ICrawlJob} from "../entities/CrawlJob";
import {ICrawlerState, IncrementStateProperty} from "../entities/CrawlerState";
import {ICrawlerService} from "../services/CrawlersService";

const CrawlersQueues = {
    [Constants.FACEBOOK_CRAWL_JOB_QUEUE]: Constants.FACEBOOK_CRAWL_JOB_QUEUE,
    [Constants.TIKTOK_CRAWL_JOB_QUEUE]: Constants.TIKTOK_CRAWL_JOB_QUEUE,
    [Constants.INSTAGRAM_CRAWL_JOB_QUEUE]: Constants.INSTAGRAM_CRAWL_JOB_QUEUE,
};
type CrawlerJobsQueue = typeof CrawlersQueues[keyof typeof CrawlersQueues];

export interface ICrawlerStateWorker{
    getIncrementStateProperty: ({crawlerId, property}: {crawlerId: string, property: IncrementStateProperty}) => Promise<number>;
    crawlerDoneHandler: (crawlerId: string) => Promise<void>;
    blockPopCrawlJob: (queue: CrawlerJobsQueue) => Promise<ICrawlJob>;
    pushCrawlJob: (crawlJob: ICrawlJob) => Promise<void>;
    pushManyCrawlJobs: ({crawlJobs, queue}: {crawlJobs: ICrawlJob[], queue: CrawlerJobsQueue}) => Promise<void>;
    getCrawlerState: (crawlerId: string) => Promise<ICrawlerState>;
    endCrawlerJob: (crawlerId: string) => Promise<void>;
    isCrawlerJobDone: ({crawlerState, newErrorCounts, newProfilesSearchedOverAll}:
                           {crawlerState: ICrawlerState, newErrorCounts?: number, newProfilesSearchedOverAll?: number}) => Promise<boolean>;
}



export class CrawlerStateWorker implements ICrawlerStateWorker{
    private logger: Logger;
    private redisClient: RedisAdapter;
    private crawlerService: ICrawlerService;
    constructor({logger, redisClient, crawlerService}: { logger: Logger, redisClient: RedisAdapter, crawlerService: ICrawlerService }) {
        this.logger = logger;
        this.redisClient = redisClient;
        this.crawlerService = crawlerService;
    }

    getCrawlerState = async (crawlerId: string): Promise<ICrawlerState> => {
        const data = {hash: `${Constants.CRAWLERS_HASH}:${crawlerId}`}
        const crawlerState = await this.redisClient.getHash(data);
        return {
            crawlerId,
            totalProfilesToSearch: parseInt(crawlerState.totalProfilesToSearch),
            errorsCount: parseInt(crawlerState.errorsCount),
            profilesSearchedOverAll: parseInt(crawlerState.profilesSearchedOverAll),
            isDone: crawlerState.isDone === "true"
        }
    }

    getIncrementStateProperty = async ({crawlerId, property}: {crawlerId: string, property: IncrementStateProperty}) => {
        const data = {hash: `${Constants.CRAWLERS_HASH}:${crawlerId}`, property }
        return await this.redisClient.incrementHashProperty(data);
    }

    async crawlerDoneHandler(crawlerId): Promise<void>  {
        const data = {hash: `${Constants.CRAWLERS_HASH}:${crawlerId}`, property: "isDone", value: true }
        await this.redisClient.setHashProperty(data);
    }

    async blockPopCrawlJob(queue: CrawlerJobsQueue): Promise<ICrawlJob>{
        const data = await this.redisClient.pop({queue, options: {shouldBeBlocked: true}});
        return new CrawlJob(JSON.parse(data));
    }

    async pushCrawlJob(crawlJob: ICrawlJob): Promise<void>{
        const data = {queue: Constants.FACEBOOK_CRAWL_JOB_QUEUE, message: JSON.stringify(crawlJob)}
        await this.redisClient.push(data);
    }

    async pushManyCrawlJobs({crawlJobs, queue}: {crawlJobs: ICrawlJob[], queue: CrawlerJobsQueue}): Promise<void>{
        const data = {queue, messages: crawlJobs.map(crawlJob => JSON.stringify(crawlJob))}
        await this.redisClient.pushMany(data);
    }

    async endCrawlerJob(crawlerId: string): Promise<void>{
        await this.crawlerService.updateCrawlerStatus({id: crawlerId, isDone: true});
    }

    async isCrawlerJobDone({crawlerState, newErrorCounts = 0, newProfilesSearchedOverAll = 0}:
                                  {crawlerState: ICrawlerState, newErrorCounts?: number, newProfilesSearchedOverAll?: number}): Promise<boolean>{
        const {totalProfilesToSearch, errorsCount, profilesSearchedOverAll} = crawlerState;
        const sumTotalErrorsCount = errorsCount + newErrorCounts;
        const sumTotalProfilesSearchedOverAll = profilesSearchedOverAll + newProfilesSearchedOverAll;
        return totalProfilesToSearch === sumTotalProfilesSearchedOverAll + sumTotalErrorsCount;
    }
}

