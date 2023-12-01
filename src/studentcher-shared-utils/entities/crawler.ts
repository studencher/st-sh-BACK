import {ICrawlerUserAccount} from "./crawler-user-account";
import {ICrawlerSearch} from "./crawler-search";
import {ICrawlerComment} from "./crawler-comment";
import { IEntity } from "./entity";


export interface ICrawler extends IEntity{
    id: string;
    description: string;
    account: ICrawlerUserAccount;
    search: ICrawlerSearch;
    comment: ICrawlerComment;
    lastStatus?: {
        createdAt: number,
        endedAt: number
    }

}

export interface ICrawlerInputData{
    commentId: string,
    accountId: string,
    searchId: string,
    description: string;
}
