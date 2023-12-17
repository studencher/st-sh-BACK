/*import { Request, Response, NextFunction } from "express";
import {Logger} from "../studentcher-shared-utils/helpers/Logger";
import crawlersService from "../services/CrawlersService";
import {ApiResponse} from "../studentcher-shared-utils";
import {ICrawlerStateWorker} from "../studentcher-shared-utils/models/CrawlerStateWorker";
import crawlerStateWorker from "../models/CrawlerStateWorker";
import {CrawlJob, ICrawlJob} from "../studentcher-shared-utils/entities/CrawlJob";
import {ICrawlerService} from "../studentcher-shared-utils/services/CrawlersService";


class CrawlersController{
    private logger: Logger;
    private crawlersService: ICrawlerService;
    private crawlerStateWorker: ICrawlerStateWorker;
    constructor({logger, crawlersService, crawlerStateWorker}: { logger: Logger, crawlersService: ICrawlerService, crawlerStateWorker: ICrawlerStateWorker }) {
        this.logger = logger;
        this.crawlersService = crawlersService;
        this.crawlerStateWorker = crawlerStateWorker;
    }

    getCrawlers = async (req: Request, res: Response, next: NextFunction) => {
        const {err, response} = await this.crawlersService.getCrawlers();
        if(err != null)
            return next(err);
        return res.status(200).send(response);
    }

    addCrawler = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            accountId: req.body.accountId,
            searchId: req.body.searchId,
            commentId: req.body.commentId,
            description: req.body.description
        }
        const {err, response} = await this.crawlersService.addCrawler(data);
        if(err != null)
            return next(err);
        return res.status(200).send(response);
    }

    edit = async (_req: Request, _res: Response, _next: NextFunction) => {
        throw new Error("Method not implemented.");
    }

    deleteCrawlers = async (req: Request, res: Response, next: NextFunction) => {
        const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] }
        const {err, response} = await this.crawlersService.deleteCrawlers(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    getComments = async (_req: Request, res: Response, next: NextFunction) => {
        const {err, response} = await this.crawlersService.getComments();
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    addComment = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            comment: req.body.comment,
            description: req.body.description
        }
        const {err, response} = await this.crawlersService.addComment(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    deleteComments = async (req: Request, res: Response, next: NextFunction) => {
        const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] }
        const {err, response} = await this.crawlersService.deleteComments(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    getSearches = async (_req: Request, res: Response, next: NextFunction) => {
        const {err, response} = await this.crawlersService.getSearches();
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    addSearch = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            keywords: Array.isArray(req.body.keywords) ? req.body.keywords : [],
            description: req.body.description
        }
        const {err, response} = await this.crawlersService.addSearch(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    deleteSearches = async (req: Request, res: Response, next: NextFunction) => {
        const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] }
        const {err, response} = await this.crawlersService.deleteSearches(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    getUserAccounts = async (_req: Request, res: Response, next: NextFunction) => {
        const {err, response} = await this.crawlersService.getUserAccounts();
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    addUserAccount = async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            username: req.body.username,
            password: req.body.password,
            description: req.body.description,
            postsCollection: req.body.postsCollection
        }
        const {err, response} = await this.crawlersService.addUserAccount(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    deleteUserAccounts = async (req: Request, res: Response, next: NextFunction) => {
        const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] }
        const {err, response} = await this.crawlersService.deleteUserAccounts(data);
        if(err != null)
            return next(err)
        return res.status(200).send(response);
    }

    addCrawlerStatus = async (req: Request, res: Response, next: NextFunction)=>{
        const requestData = {id: req.body.id};
        const {err, data} = await this.crawlersService.addCrawlerStatus(requestData);
        if(err != null)
            return next(err)
        if(data == null)
            return next(new Error("Error on addCrawlerStatus"));
        const crawlJob: ICrawlJob = new CrawlJob({crawler: data.crawler});
        await this.crawlerStateWorker.pushCrawlJob(crawlJob);
        const response = new ApiResponse(true, {data});
        return res.status(200).send(response);
    }
}

export default new CrawlersController({logger: new Logger("CrawlersController"), crawlersService, crawlerStateWorker});*/
