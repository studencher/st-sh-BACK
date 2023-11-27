import {ICrawlersRepository} from "../repositories/CrawlersRepository/ICrawlersRepository";
import {ICrawler, ICrawlerInputData} from "../entities/crawler";
import {CustomError} from "../models/CustomError";
import {Validations} from "../helpers/Validations";
import {IServiceResponse, ServiceResponse} from "../models/ServiceResponse";
import {ICrawlerSearch} from "../entities/crawler-search";
import {ApiResponse} from "../models/ApiResponse";
import {ICrawlerUserAccount, ICrawlerUserAccountInput} from "../entities/crawler-user-account";
import {ICrawlerComment} from "../entities/crawler-comment";

export interface ICrawlerService {
    getComments(): Promise<ServiceResponse<{comments: ICrawlerComment[]}>>;
    addComment({comment, description}: {comment: string, description: string}): Promise<ServiceResponse<{comment: ICrawlerComment}>>;
    deleteComments({ids}: {ids: string[]}): Promise<ServiceResponse<{comments: ICrawlerComment[]}>>;
    getUserAccounts(): Promise<ServiceResponse<{accounts: ICrawlerUserAccount[]}>>;
    addUserAccount(data: ICrawlerUserAccountInput): Promise<ServiceResponse<{account: ICrawlerUserAccount}>>;
    deleteUserAccounts({ids}: {ids: string[]}): Promise<ServiceResponse<{accounts: ICrawlerUserAccount[]}>>;
    getSearches(): Promise <ServiceResponse<{searches: ICrawlerSearch[]}>>;
    addSearch({description, keywords}: {description: string, keywords: string[]}): Promise <ServiceResponse<{search: ICrawlerSearch}>>;
    deleteSearches({ids}: {ids: string[]}): Promise<ServiceResponse<{searches: ICrawlerSearch[]}>>;
    getCrawlers(): Promise<ServiceResponse<{crawlers: ICrawler[]}>>;
    addCrawler(data: ICrawlerInputData): Promise<ServiceResponse<{crawler: ICrawler}>>;
    deleteCrawlers({ids}: {ids: string[]}): Promise<ServiceResponse<{crawlers: ICrawler[]}>>;
    addCrawlerStatus({id}: {id: string}): Promise<IServiceResponse<{crawler: ICrawler}>>;
    updateCrawlerStatus({id, isDone}: {id: string, isDone: boolean}): Promise<IServiceResponse<{}>>;
}

export class CrawlersService implements ICrawlerService {
    constructor(private crawlersRepository: ICrawlersRepository) { }

    private verifyUserAccountData(data: ICrawlerUserAccountInput): void {
        const {result, message} = Validations.isPasswordValid(data.password);
        if(!result)
            throw new CustomError(message);
    }

    public async getCrawlers(): Promise<ServiceResponse<{ crawlers: ICrawler[] }>> {
        try {
            const crawlers = await this.crawlersRepository.getAll();
            if(crawlers.length == 0)
                return {err: new CustomError("Crawlers not found", 404)}
            return {response: new ApiResponse(true, {crawlers})}
        }catch (err){
            return {err}
        }
    }
    private verifyCrawlerData(data: ICrawlerInputData): void{
        const {result, message} = Validations.areFieldsProvided(["commentId", "accountId", "searchId", "description"], data);
        if(!result)
            throw new CustomError(message);
    }
    public async addCrawler(data: ICrawlerInputData): Promise<ServiceResponse<{ crawler: ICrawler }>> {
        try{
            this.verifyCrawlerData(data);
            const crawler = await this.crawlersRepository.insertOne(data)
            return {response: new ApiResponse(true, {crawler})}
        }catch (err){
            return {err}
        }
    }

    public async deleteCrawlers(data: {ids: string[]}): Promise<ServiceResponse<{ crawlers: ICrawler[] }>> {
        try {
            if(data.ids.length === 0)
                return {err: new CustomError('No ids provided')};

            const crawlers: ICrawler[] = await this.crawlersRepository.deleteMany(data.ids);
            if(crawlers.length === 0)
                return {err: new CustomError('No crawlers found')};
            return { response: new ApiResponse(true, {crawlers}) }
        }catch (err){
            return {err};
        }
    }

    public async getComments(): Promise<ServiceResponse<{ comments: ICrawlerComment[] }>> {
        try {
            const comments: ICrawlerComment[] = await this.crawlersRepository.getComments();
            if(comments.length === 0)
                return {err: new CustomError('No comments found', 404)};

            return { response: new ApiResponse(true, {comments}) }
        }catch (err){
            return {err};
        }
    }

    public async addComment(data: {comment: string, description: string}): Promise<ServiceResponse<{comment: ICrawlerComment}>> {
        try {
            const {result, message} = Validations.areFieldsProvided(["comment", "description"], data);
            if(!result)
                return {err: new CustomError(message)}
            const addedComment: ICrawlerComment = await this.crawlersRepository.addComment(data);
            if(addedComment == null)
                return {err: new CustomError('No comment found')};

            return { response: new ApiResponse(true, {comment: addedComment}) }
        }catch (err){
            return {err};
        }
    }

    public async deleteComments(data: {ids: string[]}): Promise<ServiceResponse<{ comments: ICrawlerComment[] }>> {
        try {
            if(data.ids.length === 0)
                return {err: new CustomError('No ids provided')};

            const comments: ICrawlerComment[] = await this.crawlersRepository.deleteComments(data.ids);
            if(comments.length === 0)
                return {err: new CustomError('No comments found')};
            return { response: new ApiResponse(true, {comments}) }
        }catch (err){
            return {err};
        }
    }

    public async addUserAccount(data: ICrawlerUserAccountInput): Promise<ServiceResponse<{account: ICrawlerUserAccount}>> {
        try {
            const {result, message} = Validations.areFieldsProvided(["username", "password", "description", "postsCollection"], data);
            if(!result)
                return {err: new CustomError(message)}
            this.verifyUserAccountData(data);
            const account: ICrawlerUserAccount = await this.crawlersRepository.addUserAccount(data);
            if(account == null)
                return {err: new CustomError('No account found')};

            return { response: new ApiResponse(true, {account}) }
        }catch (err){
            return {err};
        }
    }

    public async getUserAccounts(): Promise<ServiceResponse<{ accounts: ICrawlerUserAccount[] }>> {
        try {
            const accounts: ICrawlerUserAccount[] = await this.crawlersRepository.getUserAccounts();
            if(accounts.length === 0)
                return {err: new CustomError('No user accounts found')};

            return { response: new ApiResponse(true, {accounts}) }
        }catch (err){
            return {err};
        }
    }

    public async deleteUserAccounts(data: {ids: string[]}): Promise<ServiceResponse<{ accounts: ICrawlerUserAccount[] }>> {
        try {
            if(data.ids.length === 0)
                return {err: new CustomError('No ids provided')};

            const accounts: ICrawlerUserAccount[] = await this.crawlersRepository.deleteUserAccounts(data.ids);
            if(accounts.length === 0)
                return {err: new CustomError('No user accounts found')};

            return { response: new ApiResponse(true, {accounts}) }
        }catch (err){
            return {err};
        }
    }

    public async getSearches(): Promise<ServiceResponse<{ searches: ICrawlerSearch[] }>> {
        try {
            const searches: ICrawlerSearch[] = await this.crawlersRepository.getSearches();
            if(searches.length === 0)
                return {err: new CustomError('No searches found')};

            return { response: new ApiResponse(true, {searches}) }
        }catch (err){
            return {err};
        }
    }

    public async addSearch(data: {description: string, keywords: string[]}): Promise<ServiceResponse<{search: ICrawlerSearch}>> {
        try {
            const {result, message} = Validations.areFieldsProvided(["description", "keywords"], data);
            if(!result)
                return {err: new CustomError(message)}
            if(data.keywords.length === 0)
                return {err: new CustomError('No keywords provided')};

            const search: ICrawlerSearch = await this.crawlersRepository.addSearch(data);
            return { response: new ApiResponse(true, {search}) }
        }catch (err){
            return {err};
        }
    }

    public async deleteSearches(data: {ids: string[]}): Promise<ServiceResponse<{ searches: ICrawlerSearch[] }>> {
        try {
            if(data.ids.length === 0)
                return {err: new CustomError('No ids provided')};

            const searches: ICrawlerSearch[] = await this.crawlersRepository.deleteSearches(data.ids);
            if(searches.length === 0)
                return {err: new CustomError('No searches found')};

            return { response: new ApiResponse(true, {searches}) }
        }catch (err){
            return {err};
        }
    }

    private async getVerifiedCrawler(data: {id: string}): Promise<ICrawler>{
        const {result, message} = Validations.areFieldsProvided(["id"], data);
        if(!result)
            throw new CustomError(message);
        const crawlers: ICrawler[] = await this.crawlersRepository.getAll({ids: [data.id]})
        if(crawlers.length === 0)
            throw new CustomError("Crawler not found", 404);
        const crawler = crawlers[0];
        const isCrawlerAvailable = crawler.lastStatus?.createdAt == null || crawler.lastStatus?.endedAt != null;
        if(!isCrawlerAvailable)
            throw new CustomError("Cannot start a crawl until the previous crawl has been ended.");
        return crawler;
    }
    public async addCrawlerStatus({id}: {id: string}):  Promise<IServiceResponse<{crawler: ICrawler}>>{
        try{
            const crawler = await this.getVerifiedCrawler({id});
            await this.crawlersRepository.insertCrawlerStatus(id);
            return {data: {crawler}};
        }catch (err){
            return {err}
        }
    }

    public async updateCrawlerStatus({id, isDone}: {id: string, isDone: boolean}):  Promise<IServiceResponse<{}>>{
        try{
            if(isDone !== true)
                return {err: new CustomError("isDone must be true")};
            await this.crawlersRepository.updateCrawlerStatus({id, isDone});
            return {data: {}};
        }catch (err){
            return {err}
        }
    }
}

