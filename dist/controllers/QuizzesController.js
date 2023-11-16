"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuizzesService_1 = __importDefault(require("../services/QuizzesService"));
const QuizQuestionTypesService_1 = __importDefault(require("../services/QuizQuestionTypesService"));
class QuizzesController {
    constructor(quizzesService, quizQuestionTypesService) {
        this.getQuizzes = async (req, res, next) => {
            try {
                const requestData = { userId: res.locals.userId };
                const { err, response } = await this.quizzesService.getQuizzes(requestData);
                if (err != null)
                    return next(err);
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.getQuiz = async (req, res, next) => {
            try {
                const requestData = { userId: res.locals.userId, id: req.params.id };
                const { err, response } = await this.quizzesService.getQuiz(requestData);
                if (err != null)
                    return next(err);
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.addQuiz = async (req, res, next) => {
            try {
                const requestData = {
                    createdBy: res.locals.userId,
                    name: req.body.name,
                    passingPercentageGradeInDec: req.body.passingPercentageGradeInDec,
                    timeToCompleteInSec: req.body.timeToCompleteInSec,
                    allowedAttemptNumber: req.body.allowedAttemptNumber,
                    shuffleQuestionsEnabled: req.body.shuffleQuestionsEnabled,
                    questionsResponsesHistoryEnabled: req.body.questionsResponsesHistoryEnabled,
                    questionsFeedbackEnabled: req.body.questionsFeedbackEnabled,
                    categories: req.body.categories || []
                };
                const { err, response } = await this.quizzesService.addQuiz(requestData);
                if (err != null)
                    return next(err);
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.editQuiz = async (req, res, next) => {
            try {
                const requestData = {
                    id: req.body.id,
                    name: req.body.name,
                    userId: res.locals.userId,
                    passingPercentageGradeInDec: req.body.passingPercentageGradeInDec,
                    timeToCompleteInSec: req.body.timeToCompleteInSec,
                    allowedAttemptNumber: req.body.allowedAttemptNumber,
                    shuffleQuestionsEnabled: req.body.shuffleQuestionsEnabled,
                    questionsResponsesHistoryEnabled: req.body.questionsResponsesHistoryEnabled,
                    questionsFeedbackEnabled: req.body.questionsFeedbackEnabled,
                };
                const { err, response } = await this.quizzesService.editQuiz(requestData);
                if (err != null)
                    return next(err);
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteQuizzes = async (req, res, next) => {
            try {
                const requestData = { userId: res.locals.userId, ids: req.body.ids };
                const { err, response } = await this.quizzesService.deleteQuizzes(requestData);
                if (err != null)
                    return next(err);
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.getQuizQuestionsTypes = async (req, res, next) => {
            try {
                // const _requestData = {userId: res.locals.userId}
                const { err, response } = await this.quizQuestionTypesService.getQuizQuestionsTypes();
                if (err != null)
                    return next(err);
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.startUserQuiz = async (req, res, next) => {
            try {
                const data = { userId: res.locals.userId, id: req.params.id };
                const { err, response } = await this.quizzesService.startUserQuiz(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.endUserQuiz = async (req, res, next) => {
            try {
                const data = {
                    userId: res.locals.userId,
                    id: req.params.id,
                    trialId: req.params.trialId,
                    questionsAnswers: req.body.questionsAnswers
                };
                const { err, response } = await this.quizzesService.endUserQuiz(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.getOptionalQuizzes = async (req, res, next) => {
            try {
                const data = { userId: res.locals.userId };
                const { err, response } = await this.quizzesService.getOptionalQuizzes(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.quizzesService = quizzesService;
        this.quizQuestionTypesService = quizQuestionTypesService;
    }
}
exports.default = new QuizzesController(QuizzesService_1.default, QuizQuestionTypesService_1.default);
//# sourceMappingURL=QuizzesController.js.map