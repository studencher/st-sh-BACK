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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsRepository = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const queries = __importStar(require("../helpers/postgresQueriesHelper/questionsManagement"));
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
class QuestionsRepository extends studentcher_shared_utils_1.EntityRepository {
    constructor(pgClient) {
        super();
        this.dbClient = pgClient;
    }
    async find(_data) {
        const selectQuestionsQuery = queries.getSelectQuestionsQuery();
        const selectQuestionsValues = [];
        const response = await this.dbClient.callDbCmd(selectQuestionsQuery, selectQuestionsValues);
        return response.rows;
    }
    async findFullDataById(id) {
        const selectQuestionFullDataQuery = queries.getSelectQuestionFullDataQuery();
        const selectQuestionFullDataValues = [[id]];
        const response = await this.dbClient.callDbCmd(selectQuestionFullDataQuery, selectQuestionFullDataValues);
        return response.rows[0];
    }
    async insertOne(data) {
        const insertQuestionQuery = queries.getInsertQuestionQuery();
        const insertQuestionValues = [data.title, data.content, data.createdBy, data.videoFileName];
        const response = await this.dbClient.callDbCmd(insertQuestionQuery, insertQuestionValues);
        return response.rows[0];
    }
    async editOne(data) {
        const updateQuestionQuery = queries.getUpdateQuestionQuery();
        const updateQuestionValues = [data.id, data.title, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response = await this.dbClient.callDbCmd(updateQuestionQuery, updateQuestionValues);
        return response.rows[0];
    }
    async deleteMany(data) {
        const deleteQuestionsQuery = queries.getDeleteQuestionsQuery();
        const deleteQuestionsValues = [data.ids];
        const response = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows;
    }
    async insertOneComment(data) {
        const insertQuestionQuery = queries.getInsertQuestionCommentQuery();
        const insertQuestionValues = [data.questionId, data.content, data.createdBy];
        const response = await this.dbClient.callDbCmd(insertQuestionQuery, insertQuestionValues);
        return response.rows[0];
    }
    async editQuestionComment(data) {
        const updateQuestionQuery = queries.getUpdateQuestionCommentQuery();
        const updateQuestionValues = [data.id, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response = await this.dbClient.callDbCmd(updateQuestionQuery, updateQuestionValues);
        const comment = response.rows[0];
        return comment;
    }
    async deleteQuestionComments(data) {
        const deleteQuestionsQuery = queries.getDeleteQuestionsCommentsQuery();
        const deleteQuestionsValues = [data.ids];
        const response = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows;
    }
    async insertOneAnswer(data) {
        const insertAnswerQuery = queries.getInsertAnswerQuery();
        const insertAnswerValues = [data.questionId, data.content, data.createdBy, data.videoFileName];
        const response = await this.dbClient.callDbCmd(insertAnswerQuery, insertAnswerValues);
        return response.rows[0];
    }
    async editAnswer(data) {
        const updateAnswerQuery = queries.getUpdateAnswerQuery();
        const updateAnswerValues = [data.id, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response = await this.dbClient.callDbCmd(updateAnswerQuery, updateAnswerValues);
        const comment = response.rows[0];
        return comment;
    }
    async deleteAnswers(data) {
        const deleteQuestionsQuery = queries.getDeleteAnswersQuery();
        const deleteQuestionsValues = [data.ids];
        const response = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows;
    }
    async insertAnswerComment(data) {
        const insertAnswerQuery = queries.getInsertAnswerCommentQuery();
        const insertAnswerValues = [data.answerId, data.content, data.createdBy];
        const response = await this.dbClient.callDbCmd(insertAnswerQuery, insertAnswerValues);
        return response.rows[0];
    }
    async editAnswerComment(data) {
        const updateAnswerQuery = queries.getUpdateAnswerCommentQuery();
        const updateAnswerValues = [data.id, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response = await this.dbClient.callDbCmd(updateAnswerQuery, updateAnswerValues);
        const comment = response.rows[0];
        return comment;
    }
    async deleteAnswersComments(data) {
        const deleteQuestionsQuery = queries.getDeleteAnswerCommentsQuery();
        const deleteQuestionsValues = [data.ids];
        const response = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows;
    }
}
exports.QuestionsRepository = QuestionsRepository;
exports.default = new QuestionsRepository(postgresAdapter_1.default);
//# sourceMappingURL=QuestionsRepository.js.map