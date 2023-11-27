import * as queries from "./queries";
import {ICrawlersRepository} from "./ICrawlersRepository";
import {PostgresAdapter} from "../../storage/PostgresAdapter";
import {ICrawler, ICrawlerInputData} from "../../entities/crawler";
import {DdCommand} from "../../storage/DdCommand";
import {ICrawlerSearch} from "../../entities/crawler-search";
import {ICrawlerUserAccount, ICrawlerUserAccountInput} from "../../entities/crawler-user-account";
import {ICrawlerComment} from "../../entities/crawler-comment";
import {EntityRepository} from "../EntityRepository";

export class CrawlersRepository extends EntityRepository implements ICrawlersRepository{
    private dbClient: PostgresAdapter;
    constructor(dbClient: PostgresAdapter) {
        super();
        this.dbClient = dbClient;
    }

    async insertOne({commentId, accountId, searchId, description}: ICrawlerInputData): Promise<ICrawler> {
        const query: string = queries.getInsertCrawlerQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [commentId, accountId, searchId, description]));
        return response.rows[0] as ICrawler;
    }

    async deleteMany(ids: string[]): Promise<ICrawler[]> {
        const query: string = queries.getDeleteCrawlersQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [ids]));
        return response.rows as ICrawler[];
    }

    async getAll(data?: {ids: string[]}): Promise<ICrawler[]> {
        const query: string = queries.getSelectCrawlersQuery();
        const response: any = await this.dbClient.callDb(new  DdCommand(query, [data?.ids]));
        return response.rows as ICrawler[];
    }

    async getComments(): Promise<ICrawlerComment[]> {
        const query: string = queries.getSelectCommentsQuery();

        const response: any = await this.dbClient.callDb(new  DdCommand(query, []));
        return response.rows as ICrawlerComment[];
    }

    async addComment({ comment, description }: {comment: string, description: string}): Promise<ICrawlerComment> {
        const query: string =  queries.getInsertCommentQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [comment, description]));
        return response.rows[0] as ICrawlerComment;
    }

    async deleteComments(ids: string[]): Promise<ICrawlerComment[]> {
        const query: string = queries.getDeleteCommentsQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [ids]));
        return response.rows as ICrawlerComment[];
    }

    async getUserAccounts(): Promise<ICrawlerUserAccount[]> {
        const query: string = queries.getSelectUserAccountsQuery();
        const response: any = await this.dbClient.callDb(new  DdCommand(query, []));
        return response.rows as ICrawlerUserAccount[];
    }

    async addUserAccount(data: ICrawlerUserAccountInput): Promise<ICrawlerUserAccount> {
        const query: string = queries.getInsertUserAccountQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [data.username, data.password, data.description, data.postsCollection]));
        return response.rows[0] as ICrawlerUserAccount;
    }

    async deleteUserAccounts(ids: string[]): Promise<ICrawlerUserAccount[]> {
        const query: string = queries.getDeleteUserAccountsQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [ids]));
        return response.rows as ICrawlerUserAccount[];
    }

    async addSearch({description, keywords }: {description: string, keywords: string[]}): Promise<ICrawlerSearch> {
        const query: string = queries.getInsertSearchQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [description, keywords]));
        return response.rows[0];
    }

    async getSearches(): Promise<ICrawlerSearch[]> {
        const query: string = queries.getSelectSearchesQuery();
        const response: any = await this.dbClient.callDb(new  DdCommand(query, []));
        return response.rows;
    }

    async deleteSearches(ids: string[]): Promise<ICrawlerSearch[]> {
        const query: string = queries.getDeleteSearchesQuery();
        const response: any = await this.dbClient.callDb(new DdCommand(query, [ids]));
        return response.rows;
    }

    async insertCrawlerStatus(id: string): Promise<void>{
        const query: string = queries.getInsertCrawlerStatusQuery();
        await this.dbClient.callDb(new DdCommand(query, [id]));
    }

    async updateCrawlerStatus({id, isDone}: {id: string, isDone: boolean}): Promise<void>{
        const query: string = queries.getUpdateCrawlerStatusQuery();
        await this.dbClient.callDb(new DdCommand(query, [id, isDone]));
    }
}


