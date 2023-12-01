import {ICrawler} from "./crawler";

export interface ICrawlJob {
    crawler: ICrawler;
    url?: string;
    getCrawlerCopy: () => ICrawler;
    getCrawlerId: () => string;
    getUrl: () => string;
    getPostsCollection: () => string;
    getComment: () => string;
    getUserName: () => string;
    getPassword: () => string;
    getKeywords: () => string[];
    toString: () => string;
}

export class CrawlJob implements ICrawlJob {
    crawler: ICrawler;
    url?: string;

    constructor({crawler, url}: { crawler: ICrawler, url?: string }) {
        this.crawler = crawler;
        this.url = url;
    }

    public getCrawlerCopy = () => {
        return JSON.parse(JSON.stringify(this.crawler));
    }

    public getCrawlerId = () => {
        return this.crawler.id;
    }

    public getUrl = () => {
        return this.url;
    }

    getPostsCollection = () => {
        return this.crawler.account.postsCollection;
    }

    getComment = () =>{
        return this.crawler.comment.text;
    }

    getUserName = () => {
        return this.crawler.account.username;
    }

    getPassword = () => {
        return this.crawler.account.password;
    }

    getKeywords = () => {
        return this.crawler.search.keywords;
    }

    public toString = (): string => {
        return `
            crawlerId: ${this.getCrawlerId()},
            url: ${this.getUrl()},
            postsCollection: ${this.getPostsCollection()},
            comment: ${this.getComment()},
            username: ${this.getUserName()},
            password: ${this.getPassword()},
            keywords: ${this.getKeywords()}`
    }
}
