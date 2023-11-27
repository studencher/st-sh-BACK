import {ICrawler, ICrawlerInputData} from "../../entities/crawler";
import {ICrawlerComment} from "../../entities/crawler-comment";
import {ICrawlerUserAccount, ICrawlerUserAccountInput} from "../../entities/crawler-user-account";
import {ICrawlerSearch} from "../../entities/crawler-search";

export interface ICrawlersRepository {
    getAll(data?: {ids: string[]}): Promise<ICrawler[]>;
    insertOne({commentId, accountId, searchId, description}: ICrawlerInputData): Promise<ICrawler>;
    deleteMany(ids: string[]): Promise<ICrawler[]>;
    getComments(): Promise<ICrawlerComment[]>;
    addComment({ comment, description }: {comment: string, description: string}): Promise<ICrawlerComment>;
    deleteComments(ids: string[]): Promise<ICrawlerComment[]>;
    getUserAccounts(): Promise<ICrawlerUserAccount[]>;
    addUserAccount(data: ICrawlerUserAccountInput): Promise<ICrawlerUserAccount>;
    deleteUserAccounts(ids: string[]): Promise<ICrawlerUserAccount[]>;
    getSearches(): Promise<ICrawlerSearch[]>;
    addSearch({description, keywords}: {description: string, keywords: string[]}): Promise<ICrawlerSearch>;
    deleteSearches(ids: string[]): Promise<ICrawlerSearch[]>;
    insertCrawlerStatus(id: string): Promise<void>;
    updateCrawlerStatus({id, isDone}:{id: string, isDone: boolean}): Promise<void>;
}
