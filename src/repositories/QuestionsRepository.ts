import {EntityRepository, IClientRequestData} from "../studentcher-shared-utils";
import * as queries from "../helpers/postgresQueriesHelper/questionsManagement";
import {PostgresAdapter} from "../studentcher-shared-utils/storage/PostgresAdapter";
import {
    IAnswer,
    IAnswerComment,
    IQuestion,
    IQuestionComment,
    IQuestionFullData
} from "../studentcher-shared-utils/entities/question";
import pgClient from "../storage/postgresAdapter";

export class QuestionsRepository extends EntityRepository{
    private dbClient : PostgresAdapter;
    constructor(pgClient) {
        super();
        this.dbClient = pgClient;
    }

    async find(_data: IClientRequestData): Promise<IQuestion[]>{
        const selectQuestionsQuery: string = queries.getSelectQuestionsQuery();
        const selectQuestionsValues: any = [];
        const response = await this.dbClient.callDbCmd(selectQuestionsQuery, selectQuestionsValues);

        return response.rows;
    }

    async findFullDataById(id: string) : Promise<IQuestionFullData>{
        const selectQuestionFullDataQuery = queries.getSelectQuestionFullDataQuery();
        const selectQuestionFullDataValues = [[id]];
        const response = await this.dbClient.callDbCmd(selectQuestionFullDataQuery, selectQuestionFullDataValues);
        return response.rows[0] as IQuestionFullData;
    }
    async insertOne(data: IClientRequestData) :Promise<IQuestion>{
        const insertQuestionQuery: string = queries.getInsertQuestionQuery();
        const insertQuestionValues: any = [data.title, data.content, data.createdBy, data.videoFileName];
        const response: any = await this.dbClient.callDbCmd(insertQuestionQuery, insertQuestionValues);
        return response.rows[0] as IQuestion;
    }

    async editOne(data: IClientRequestData) : Promise<IQuestion>{
        const updateQuestionQuery: string = queries.getUpdateQuestionQuery();
        const updateQuestionValues: any = [data.id, data.title, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response: any = await this.dbClient.callDbCmd(updateQuestionQuery, updateQuestionValues);
        return response.rows[0] as IQuestion;
    }

    async deleteMany(data: IClientRequestData) : Promise<IQuestion[]>{
        const deleteQuestionsQuery: string = queries.getDeleteQuestionsQuery();
        const deleteQuestionsValues: any = [data.ids];
        const response: any = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows as IQuestion[];
    }

    async insertOneComment(data: IClientRequestData) :Promise<IQuestionComment>{
        const insertQuestionQuery: string = queries.getInsertQuestionCommentQuery();
        const insertQuestionValues: any = [data.questionId, data.content, data.createdBy];
        const response: any = await this.dbClient.callDbCmd(insertQuestionQuery, insertQuestionValues);
        return response.rows[0] as IQuestionComment;
    }
    async editQuestionComment(data: IClientRequestData) : Promise<IQuestionComment>{
        const updateQuestionQuery: string = queries.getUpdateQuestionCommentQuery();
        const updateQuestionValues: any = [data.id, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response: any = await this.dbClient.callDbCmd(updateQuestionQuery, updateQuestionValues);
        const comment = response.rows[0] as IQuestionComment;
        return comment;
    }
    async deleteQuestionComments(data: IClientRequestData) : Promise<IQuestionComment[]>{
        const deleteQuestionsQuery: string = queries.getDeleteQuestionsCommentsQuery();
        const deleteQuestionsValues: any = [data.ids];
        const response: any = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows as IQuestionComment[];
    }

    async insertOneAnswer(data: IClientRequestData) :Promise<IAnswer>{
        const insertAnswerQuery: string = queries.getInsertAnswerQuery();
        const insertAnswerValues: any = [data.questionId, data.content, data.createdBy, data.videoFileName];
        const response: any = await this.dbClient.callDbCmd(insertAnswerQuery, insertAnswerValues);
        return response.rows[0] as IAnswer;
    }
    async editAnswer(data: IClientRequestData) : Promise<IAnswer>{
        const updateAnswerQuery: string = queries.getUpdateAnswerQuery();
        const updateAnswerValues: any = [data.id, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response: any = await this.dbClient.callDbCmd(updateAnswerQuery, updateAnswerValues);
        const comment = response.rows[0] as IAnswer;
        return comment;
    }
    async deleteAnswers(data: IClientRequestData) : Promise<IAnswer[]>{
        const deleteQuestionsQuery: string = queries.getDeleteAnswersQuery();
        const deleteQuestionsValues: any = [data.ids];
        const response: any = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows as IAnswer[];
    }
    async insertAnswerComment(data: IClientRequestData) :Promise<IAnswerComment>{
        const insertAnswerQuery: string = queries.getInsertAnswerCommentQuery();
        const insertAnswerValues: any = [data.answerId, data.content, data.createdBy];
        const response: any = await this.dbClient.callDbCmd(insertAnswerQuery, insertAnswerValues);
        return response.rows[0] as IAnswerComment;
    }
    async editAnswerComment(data: IClientRequestData) : Promise<IAnswerComment>{
        const updateAnswerQuery: string = queries.getUpdateAnswerCommentQuery();
        const updateAnswerValues: any = [data.id, data.content, data.createdBy, data.votesSum, data.votesSumDelta];
        const response: any = await this.dbClient.callDbCmd(updateAnswerQuery, updateAnswerValues);
        const comment = response.rows[0] as IAnswerComment;
        return comment;
    }
    async deleteAnswersComments(data: IClientRequestData) : Promise<IAnswerComment[]>{
        const deleteQuestionsQuery: string = queries.getDeleteAnswerCommentsQuery();
        const deleteQuestionsValues: any = [data.ids];
        const response: any = await this.dbClient.callDbCmd(deleteQuestionsQuery, deleteQuestionsValues);
        return response.rows as IAnswerComment[];
    }
}


export default new QuestionsRepository(pgClient);
