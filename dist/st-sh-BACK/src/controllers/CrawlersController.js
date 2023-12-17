"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../studentcher-shared-utils/helpers/Logger");
const CrawlersService_1 = __importDefault(require("../services/CrawlersService"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const CrawlerStateWorker_1 = __importDefault(require("../models/CrawlerStateWorker"));
const CrawlJob_1 = require("../studentcher-shared-utils/entities/CrawlJob");
class CrawlersController {
    constructor({ logger, crawlersService, crawlerStateWorker }) {
        this.getCrawlers = async (req, res, next) => {
            const { err, response } = await this.crawlersService.getCrawlers();
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.addCrawler = async (req, res, next) => {
            const data = {
                accountId: req.body.accountId,
                searchId: req.body.searchId,
                commentId: req.body.commentId,
                description: req.body.description
            };
            const { err, response } = await this.crawlersService.addCrawler(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.edit = async (_req, _res, _next) => {
            throw new Error("Method not implemented.");
        };
        this.deleteCrawlers = async (req, res, next) => {
            const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] };
            const { err, response } = await this.crawlersService.deleteCrawlers(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.getComments = async (_req, res, next) => {
            const { err, response } = await this.crawlersService.getComments();
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.addComment = async (req, res, next) => {
            const data = {
                comment: req.body.comment,
                description: req.body.description
            };
            const { err, response } = await this.crawlersService.addComment(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.deleteComments = async (req, res, next) => {
            const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] };
            const { err, response } = await this.crawlersService.deleteComments(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.getSearches = async (_req, res, next) => {
            const { err, response } = await this.crawlersService.getSearches();
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.addSearch = async (req, res, next) => {
            const data = {
                keywords: Array.isArray(req.body.keywords) ? req.body.keywords : [],
                description: req.body.description
            };
            const { err, response } = await this.crawlersService.addSearch(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.deleteSearches = async (req, res, next) => {
            const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] };
            const { err, response } = await this.crawlersService.deleteSearches(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.getUserAccounts = async (_req, res, next) => {
            const { err, response } = await this.crawlersService.getUserAccounts();
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.addUserAccount = async (req, res, next) => {
            const data = {
                username: req.body.username,
                password: req.body.password,
                description: req.body.description,
                postsCollection: req.body.postsCollection
            };
            const { err, response } = await this.crawlersService.addUserAccount(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.deleteUserAccounts = async (req, res, next) => {
            const data = { ids: Array.isArray(req.body.ids) ? req.body.ids : [] };
            const { err, response } = await this.crawlersService.deleteUserAccounts(data);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.addCrawlerStatus = async (req, res, next) => {
            const requestData = { id: req.body.id };
            const { err, data } = await this.crawlersService.addCrawlerStatus(requestData);
            if (err != null)
                return next(err);
            if (data == null)
                return next(new Error("Error on addCrawlerStatus"));
            const crawlJob = new CrawlJob_1.CrawlJob({ crawler: data.crawler });
            await this.crawlerStateWorker.pushCrawlJob(crawlJob);
            const response = new studentcher_shared_utils_1.ApiResponse(true, { data });
            return res.status(200).send(response);
        };
        this.logger = logger;
        this.crawlersService = crawlersService;
        this.crawlerStateWorker = crawlerStateWorker;
    }
}
exports.default = new CrawlersController({ logger: new Logger_1.Logger("CrawlersController"), crawlersService: CrawlersService_1.default, crawlerStateWorker: CrawlerStateWorker_1.default });
//# sourceMappingURL=CrawlersController.js.map