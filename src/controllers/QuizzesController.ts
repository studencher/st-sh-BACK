import { NextFunction, Request, Response } from 'express';
import {IQuizzesService} from "../studentcher-shared-utils/services/QuizzesService";
import quizzesService from "../services/QuizzesService";
import quizQuestionTypesService from "../services/QuizQuestionTypesService";
import {IQuizQuestionTypesService} from "../studentcher-shared-utils/services/QuizQuestionTypesService";

class QuizzesController {
    quizzesService: IQuizzesService
    quizQuestionTypesService: IQuizQuestionTypesService
    constructor(quizzesService: IQuizzesService, quizQuestionTypesService: IQuizQuestionTypesService) {
        this.quizzesService = quizzesService
        this.quizQuestionTypesService = quizQuestionTypesService;
    }
    getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestData = {userId: res.locals.userId}
            const {err, response} = await this.quizzesService.getQuizzes(requestData);
            if(err != null)
                return next(err)
            res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }
    getQuiz = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestData = {userId: res.locals.userId, id: req.params.id}
            const {err, response} = await this.quizzesService.getQuiz(requestData);
            if(err != null)
                return next(err)
            res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }
    addQuiz = async (req: Request, res: Response, next: NextFunction) => {
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
            }
            const {err, response} = await this.quizzesService.addQuiz(requestData);
            if(err != null)
                return next(err)
            res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }

    editQuiz =  async (req: Request, res: Response, next: NextFunction) => {
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
            }
            const {err, response} = await this.quizzesService.editQuiz(requestData);
            if(err != null)
                return next(err)
            res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }

    deleteQuizzes  = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const requestData = {userId: res.locals.userId, ids: req.body.ids};
            const {err, response} = await this.quizzesService.deleteQuizzes(requestData);
            if(err != null)
                return next(err)
            res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }

    getQuizQuestionsTypes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const _requestData = {userId: res.locals.userId}
            const {err, response} = await this.quizQuestionTypesService.getQuizQuestionsTypes();
            if(err != null)
                return next(err)
            res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }

    startUserQuiz = async (req: Request, res: Response, next: Function) => {
        try {
            const data = { userId: res.locals.userId, id: req.params.id };
            const {err, response} = await this.quizzesService.startUserQuiz(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }

    endUserQuiz =  async (req: Request, res: Response, next: Function) => {
        try {
            const data = {
                userId: res.locals.userId,
                id: req.params.id,
                trialId: req.params.trialId,
                questionsAnswers: req.body.questionsAnswers
            }
            const {err, response} = await this.quizzesService.endUserQuiz(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }
    getOptionalQuizzes = async (req: Request, res: Response, next: Function) => {
        try {
            const data = {userId: res.locals.userId}
            const {err, response} = await this.quizzesService.getOptionalQuizzes(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }
}

export default new QuizzesController(quizzesService, quizQuestionTypesService)
