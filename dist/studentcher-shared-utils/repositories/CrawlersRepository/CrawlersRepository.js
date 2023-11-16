"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlersRepository = void 0;
const queries = __importStar(require("./queries"));
const DdCommand_1 = require("../../storage/DdCommand");
const EntityRepository_1 = require("../EntityRepository");
class CrawlersRepository extends EntityRepository_1.EntityRepository {
    constructor(dbClient) {
        super();
        this.dbClient = dbClient;
    }
    async insertOne({ commentId, accountId, searchId, description }) {
        const query = queries.getInsertCrawlerQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [commentId, accountId, searchId, description]));
        return response.rows[0];
    }
    async deleteMany(ids) {
        const query = queries.getDeleteCrawlersQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [ids]));
        return response.rows;
    }
    async getAll(data) {
        const query = queries.getSelectCrawlersQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [data === null || data === void 0 ? void 0 : data.ids]));
        return response.rows;
    }
    async getComments() {
        const query = queries.getSelectCommentsQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, []));
        return response.rows;
    }
    async addComment({ comment, description }) {
        const query = queries.getInsertCommentQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [comment, description]));
        return response.rows[0];
    }
    async deleteComments(ids) {
        const query = queries.getDeleteCommentsQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [ids]));
        return response.rows;
    }
    async getUserAccounts() {
        const query = queries.getSelectUserAccountsQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, []));
        return response.rows;
    }
    async addUserAccount(data) {
        const query = queries.getInsertUserAccountQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [data.username, data.password, data.description, data.postsCollection]));
        return response.rows[0];
    }
    async deleteUserAccounts(ids) {
        const query = queries.getDeleteUserAccountsQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [ids]));
        return response.rows;
    }
    async addSearch({ description, keywords }) {
        const query = queries.getInsertSearchQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [description, keywords]));
        return response.rows[0];
    }
    async getSearches() {
        const query = queries.getSelectSearchesQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, []));
        return response.rows;
    }
    async deleteSearches(ids) {
        const query = queries.getDeleteSearchesQuery();
        const response = await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [ids]));
        return response.rows;
    }
    async insertCrawlerStatus(id) {
        const query = queries.getInsertCrawlerStatusQuery();
        await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [id]));
    }
    async updateCrawlerStatus({ id, isDone }) {
        const query = queries.getUpdateCrawlerStatusQuery();
        await this.dbClient.callDb(new DdCommand_1.DdCommand(query, [id, isDone]));
    }
}
exports.CrawlersRepository = CrawlersRepository;
//# sourceMappingURL=CrawlersRepository.js.map