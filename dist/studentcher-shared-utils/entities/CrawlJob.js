"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlJob = void 0;
class CrawlJob {
    constructor({ crawler, url }) {
        this.getCrawlerCopy = () => {
            return JSON.parse(JSON.stringify(this.crawler));
        };
        this.getCrawlerId = () => {
            return this.crawler.id;
        };
        this.getUrl = () => {
            return this.url;
        };
        this.getPostsCollection = () => {
            return this.crawler.account.postsCollection;
        };
        this.getComment = () => {
            return this.crawler.comment.text;
        };
        this.getUserName = () => {
            return this.crawler.account.username;
        };
        this.getPassword = () => {
            return this.crawler.account.password;
        };
        this.getKeywords = () => {
            return this.crawler.search.keywords;
        };
        this.toString = () => {
            return `
            crawlerId: ${this.getCrawlerId()},
            url: ${this.getUrl()},
            postsCollection: ${this.getPostsCollection()},
            comment: ${this.getComment()},
            username: ${this.getUserName()},
            password: ${this.getPassword()},
            keywords: ${this.getKeywords()}`;
        };
        this.crawler = crawler;
        this.url = url;
    }
}
exports.CrawlJob = CrawlJob;
//# sourceMappingURL=CrawlJob.js.map