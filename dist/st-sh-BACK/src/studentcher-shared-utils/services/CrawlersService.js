"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlersService = void 0;
const CustomError_1 = require("../models/CustomError");
const Validations_1 = require("../helpers/Validations");
const ApiResponse_1 = require("../models/ApiResponse");
class CrawlersService {
    constructor(crawlersRepository) {
        this.crawlersRepository = crawlersRepository;
    }
    verifyUserAccountData(data) {
        const { result, message } = Validations_1.Validations.isPasswordValid(data.password);
        if (!result)
            throw new CustomError_1.CustomError(message);
    }
    async getCrawlers() {
        try {
            const crawlers = await this.crawlersRepository.getAll();
            if (crawlers.length == 0)
                return { err: new CustomError_1.CustomError("Crawlers not found", 404) };
            return { response: new ApiResponse_1.ApiResponse(true, { crawlers }) };
        }
        catch (err) {
            return { err };
        }
    }
    verifyCrawlerData(data) {
        const { result, message } = Validations_1.Validations.areFieldsProvided(["commentId", "accountId", "searchId", "description"], data);
        if (!result)
            throw new CustomError_1.CustomError(message);
    }
    async addCrawler(data) {
        try {
            this.verifyCrawlerData(data);
            const crawler = await this.crawlersRepository.insertOne(data);
            return { response: new ApiResponse_1.ApiResponse(true, { crawler }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteCrawlers(data) {
        try {
            if (data.ids.length === 0)
                return { err: new CustomError_1.CustomError('No ids provided') };
            const crawlers = await this.crawlersRepository.deleteMany(data.ids);
            if (crawlers.length === 0)
                return { err: new CustomError_1.CustomError('No crawlers found') };
            return { response: new ApiResponse_1.ApiResponse(true, { crawlers }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getComments() {
        try {
            const comments = await this.crawlersRepository.getComments();
            if (comments.length === 0)
                return { err: new CustomError_1.CustomError('No comments found', 404) };
            return { response: new ApiResponse_1.ApiResponse(true, { comments }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addComment(data) {
        try {
            const { result, message } = Validations_1.Validations.areFieldsProvided(["comment", "description"], data);
            if (!result)
                return { err: new CustomError_1.CustomError(message) };
            const addedComment = await this.crawlersRepository.addComment(data);
            if (addedComment == null)
                return { err: new CustomError_1.CustomError('No comment found') };
            return { response: new ApiResponse_1.ApiResponse(true, { comment: addedComment }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteComments(data) {
        try {
            if (data.ids.length === 0)
                return { err: new CustomError_1.CustomError('No ids provided') };
            const comments = await this.crawlersRepository.deleteComments(data.ids);
            if (comments.length === 0)
                return { err: new CustomError_1.CustomError('No comments found') };
            return { response: new ApiResponse_1.ApiResponse(true, { comments }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addUserAccount(data) {
        try {
            const { result, message } = Validations_1.Validations.areFieldsProvided(["username", "password", "description", "postsCollection"], data);
            if (!result)
                return { err: new CustomError_1.CustomError(message) };
            this.verifyUserAccountData(data);
            const account = await this.crawlersRepository.addUserAccount(data);
            if (account == null)
                return { err: new CustomError_1.CustomError('No account found') };
            return { response: new ApiResponse_1.ApiResponse(true, { account }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getUserAccounts() {
        try {
            const accounts = await this.crawlersRepository.getUserAccounts();
            if (accounts.length === 0)
                return { err: new CustomError_1.CustomError('No user accounts found') };
            return { response: new ApiResponse_1.ApiResponse(true, { accounts }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteUserAccounts(data) {
        try {
            if (data.ids.length === 0)
                return { err: new CustomError_1.CustomError('No ids provided') };
            const accounts = await this.crawlersRepository.deleteUserAccounts(data.ids);
            if (accounts.length === 0)
                return { err: new CustomError_1.CustomError('No user accounts found') };
            return { response: new ApiResponse_1.ApiResponse(true, { accounts }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getSearches() {
        try {
            const searches = await this.crawlersRepository.getSearches();
            if (searches.length === 0)
                return { err: new CustomError_1.CustomError('No searches found') };
            return { response: new ApiResponse_1.ApiResponse(true, { searches }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addSearch(data) {
        try {
            const { result, message } = Validations_1.Validations.areFieldsProvided(["description", "keywords"], data);
            if (!result)
                return { err: new CustomError_1.CustomError(message) };
            if (data.keywords.length === 0)
                return { err: new CustomError_1.CustomError('No keywords provided') };
            const search = await this.crawlersRepository.addSearch(data);
            return { response: new ApiResponse_1.ApiResponse(true, { search }) };
        }
        catch (err) {
            return { err };
        }
    }
    async deleteSearches(data) {
        try {
            if (data.ids.length === 0)
                return { err: new CustomError_1.CustomError('No ids provided') };
            const searches = await this.crawlersRepository.deleteSearches(data.ids);
            if (searches.length === 0)
                return { err: new CustomError_1.CustomError('No searches found') };
            return { response: new ApiResponse_1.ApiResponse(true, { searches }) };
        }
        catch (err) {
            return { err };
        }
    }
    async getVerifiedCrawler(data) {
        var _a, _b;
        const { result, message } = Validations_1.Validations.areFieldsProvided(["id"], data);
        if (!result)
            throw new CustomError_1.CustomError(message);
        const crawlers = await this.crawlersRepository.getAll({ ids: [data.id] });
        if (crawlers.length === 0)
            throw new CustomError_1.CustomError("Crawler not found", 404);
        const crawler = crawlers[0];
        const isCrawlerAvailable = ((_a = crawler.lastStatus) === null || _a === void 0 ? void 0 : _a.createdAt) == null || ((_b = crawler.lastStatus) === null || _b === void 0 ? void 0 : _b.endedAt) != null;
        if (!isCrawlerAvailable)
            throw new CustomError_1.CustomError("Cannot start a crawl until the previous crawl has been ended.");
        return crawler;
    }
    async addCrawlerStatus({ id }) {
        try {
            const crawler = await this.getVerifiedCrawler({ id });
            await this.crawlersRepository.insertCrawlerStatus(id);
            return { data: { crawler } };
        }
        catch (err) {
            return { err };
        }
    }
    async updateCrawlerStatus({ id, isDone }) {
        try {
            if (isDone !== true)
                return { err: new CustomError_1.CustomError("isDone must be true") };
            await this.crawlersRepository.updateCrawlerStatus({ id, isDone });
            return { data: {} };
        }
        catch (err) {
            return { err };
        }
    }
}
exports.CrawlersService = CrawlersService;
//# sourceMappingURL=CrawlersService.js.map