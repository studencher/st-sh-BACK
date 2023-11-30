"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuestionsService_1 = __importDefault(require("../services/QuestionsService"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
class QuestionsController {
    constructor(questionsService, logger) {
        this.getQuestions = async (req, res, next) => {
            const requestData = {
                userId: res.locals.userId
            };
            const { err, response } = await this.questionsService.getQuestions(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`GET /questions request ended.`);
            return res.status(200).send(response);
        };
        this.getQuestion = async (req, res, next) => {
            const requestData = {
                userId: res.locals.userId,
                id: req.params.id
            };
            const { err, response } = await this.questionsService.getQuestionFullData(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`GET /questions/full-data request ended.`);
            return res.status(200).send(response);
        };
        this.postQuestion = async (req, res, next) => {
            const requestData = {
                createdBy: res.locals.userId,
                title: req.body.title,
                content: req.body.content,
                videoFileName: req.body.videoFileName
            };
            const { err, response } = await this.questionsService.addQuestion(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`POST /questions request ended for ${requestData.title}`);
            return res.status(200).send({ data: response });
        };
        this.patchQuestion = async (req, res, next) => {
            const requestData = {
                id: req.body.id,
                committedByUserId: res.locals.userId,
                title: req.body.title,
                content: req.body.content,
                votesSum: null,
                votesSumDelta: req.body.votesSumDelta
            };
            const { err, response } = await this.questionsService.editQuestion(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`PATCH /questions request ended for ${requestData.id}`);
            return res.status(200).send(response);
        };
        this.deleteQuestion = async (req, res, next) => {
            const requestData = {
                ids: Array.isArray(req.body.ids) ? req.body.ids : null,
                committedByUserId: res.locals.userId
            };
            const { err, response } = await this.questionsService.deleteQuestions(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`DELETE /questions request ended for ${requestData.ids.join()}`);
            return res.status(200).send(response);
        };
        this.postQuestionComment = async (req, res, next) => {
            const requestData = {
                questionId: req.body.questionId,
                createdBy: res.locals.userId,
                content: req.body.content,
            };
            const { err, response } = await this.questionsService.addQuestionComment(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`POST /questions/comments request ended for ${requestData.createdBy}`);
            return res.status(200).send(response);
        };
        this.patchQuestionComment = async (req, res, next) => {
            const requestData = {
                id: req.body.id,
                committedByUserId: res.locals.userId,
                content: req.body.content,
                votesSum: null,
                votesSumDelta: req.body.votesSumDelta
            };
            const { err, response } = await this.questionsService.editQuestionComment(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`PATCH /questions request ended for ${requestData.id}`);
            return res.status(200).send(response);
        };
        this.deleteQuestionComments = async (req, res, next) => {
            const requestData = {
                ids: Array.isArray(req.body.ids) ? req.body.ids : null,
                committedByUserId: res.locals.userId
            };
            const { err, response } = await this.questionsService.deleteQuestionComments(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`DELETE /questions request ended for ${requestData.ids.join()}`);
            return res.status(200).send(response);
        };
        this.postAnswer = async (req, res, next) => {
            const requestData = {
                questionId: req.body.questionId,
                createdBy: res.locals.userId,
                content: req.body.content,
                videoFileName: req.body.videoFileName
            };
            const { err, response } = await this.questionsService.addAnswer(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`POST /questions/answers request ended for ${requestData.createdBy}`);
            return res.status(200).send(response);
        };
        this.patchAnswer = async (req, res, next) => {
            const requestData = {
                id: req.body.id,
                committedByUserId: res.locals.userId,
                content: req.body.content,
                votesSum: null,
                votesSumDelta: req.body.votesSumDelta
            };
            const { err, response } = await this.questionsService.editAnswer(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`PATCH /questions/answers request ended for ${requestData.id}`);
            return res.status(200).send(response);
        };
        this.deleteAnswers = async (req, res, next) => {
            const requestData = {
                ids: Array.isArray(req.body.ids) ? req.body.ids : null,
                committedByUserId: res.locals.userId
            };
            const { err, response } = await this.questionsService.deleteAnswers(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`DELETE /questions/answers request ended for ${requestData.ids.join()}`);
            return res.status(200).send(response);
        };
        this.postAnswerComment = async (req, res, next) => {
            const requestData = {
                answerId: req.body.answerId,
                createdBy: res.locals.userId,
                content: req.body.content,
            };
            const { err, response } = await this.questionsService.addAnswerComment(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`POST /questions/answers/comments/ request ended for ${requestData.createdBy}`);
            return res.status(200).send(response);
        };
        this.patchAnswerComment = async (req, res, next) => {
            const requestData = {
                id: req.body.id,
                committedByUserId: res.locals.userId,
                content: req.body.content,
                votesSum: null,
                votesSumDelta: req.body.votesSumDelta
            };
            const { err, response } = await this.questionsService.editAnswerComment(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`PATCH /questions/answers/comments/ request ended for ${requestData.id}`);
            return res.status(200).send(response);
        };
        this.deleteAnswerComments = async (req, res, next) => {
            const requestData = {
                ids: Array.isArray(req.body.ids) ? req.body.ids : null,
                committedByUserId: res.locals.userId
            };
            const { err, response } = await this.questionsService.deleteAnswerComments(requestData);
            if (err != null)
                return next(err);
            this.logger.info(`DELETE /questions/answers/comments/ request ended for ${requestData.ids.join()}`);
            return res.status(200).send(response);
        };
        this.questionsService = questionsService;
        this.logger = logger;
    }
}
exports.default = new QuestionsController(QuestionsService_1.default, Logger_1.default);
//# sourceMappingURL=QuestionsController.js.map