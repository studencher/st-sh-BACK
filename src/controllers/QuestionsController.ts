import { NextFunction, Request, Response } from 'express';
import questionsService, {IQuestionsService} from "../services/QuestionsService";
import logger from "../helpers/Logger";
import {Logger} from "../studentcher-shared-utils/helpers/Logger";

class QuestionsController {
    questionsService: IQuestionsService;
    logger: Logger
    constructor(questionsService, logger) {
        this.questionsService = questionsService;
        this.logger = logger;
    }
    getQuestions = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            userId: res.locals.userId
        };
        const {err, response} = await this.questionsService.getQuestions(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`GET /questions request ended.`)
        return res.status(200).send(response);
    }

    getQuestion = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            userId: res.locals.userId,
            id: req.params.id
        };
        const {err, response} = await this.questionsService.getQuestionFullData(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`GET /questions/full-data request ended.`)
        return res.status(200).send(response);
    }

    postQuestion = async(req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            createdBy: res.locals.userId,
            title: req.body.title,
            content: req.body.content,
            videoFileName: req.body.videoFileName
        }
        const {err, response} = await this.questionsService.addQuestion(requestData);
        if(err != null)
            return next(err)
        this.logger.info(`POST /questions request ended for ${requestData.title}`);
        return res.status(200).send({ data: response });
    }

    patchQuestion = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            id: req.body.id,
            committedByUserId: res.locals.userId,
            title: req.body.title,
            content: req.body.content,
            votesSum: null,
            votesSumDelta: req.body.votesSumDelta
        };
        const {err, response} = await this.questionsService.editQuestion(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`PATCH /questions request ended for ${requestData.id}`)
        return res.status(200).send(response);
    }
    deleteQuestion  = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            ids: Array.isArray(req.body.ids) ? req.body.ids : null,
            committedByUserId: res.locals.userId
        };
        const {err, response} = await this.questionsService.deleteQuestions(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`DELETE /questions request ended for ${requestData.ids.join()}`)
        return res.status(200).send(response);
    }

    postQuestionComment = async(req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            questionId: req.body.questionId,
            createdBy: res.locals.userId,
            content: req.body.content,
        }
        const {err, response} = await this.questionsService.addQuestionComment(requestData);
        if(err != null)
            return next(err)
        this.logger.info(`POST /questions/comments request ended for ${requestData.createdBy}`)
        return res.status(200).send(response);
    }
    patchQuestionComment = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            id: req.body.id,
            committedByUserId: res.locals.userId,
            content: req.body.content,
            votesSum: null,
            votesSumDelta: req.body.votesSumDelta
        };
        const {err, response} = await this.questionsService.editQuestionComment(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`PATCH /questions request ended for ${requestData.id}`)
        return res.status(200).send(response);
    }
    deleteQuestionComments = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            ids: Array.isArray(req.body.ids) ? req.body.ids : null,
            committedByUserId: res.locals.userId
        };
        const {err, response} = await this.questionsService.deleteQuestionComments(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`DELETE /questions request ended for ${requestData.ids.join()}`)
        return res.status(200).send(response);
    }

    postAnswer = async(req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            questionId: req.body.questionId,
            createdBy: res.locals.userId,
            content: req.body.content,
            videoFileName: req.body.videoFileName
        }
        const {err, response} = await this.questionsService.addAnswer(requestData);
        if(err != null)
            return next(err)
        this.logger.info(`POST /questions/answers request ended for ${requestData.createdBy}`)
        return res.status(200).send(response);
    }
    patchAnswer = async (req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            id: req.body.id,
            committedByUserId: res.locals.userId,
            content: req.body.content,
            votesSum: null,
            votesSumDelta: req.body.votesSumDelta
        };
        const {err, response} = await this.questionsService.editAnswer(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`PATCH /questions/answers request ended for ${requestData.id}`)
        return res.status(200).send(response);
    }

    deleteAnswers = async (req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            ids: Array.isArray(req.body.ids) ? req.body.ids : null,
            committedByUserId: res.locals.userId
        };
        const {err, response} = await this.questionsService.deleteAnswers(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`DELETE /questions/answers request ended for ${requestData.ids.join()}`)
        return res.status(200).send(response);
    }

    postAnswerComment =  async(req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            answerId: req.body.answerId,
            createdBy: res.locals.userId,
            content: req.body.content,
        }
        const {err, response} = await this.questionsService.addAnswerComment(requestData);
        if(err != null)
            return next(err)
        this.logger.info(`POST /questions/answers/comments/ request ended for ${requestData.createdBy}`)
        return res.status(200).send(response);
    }

    patchAnswerComment = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            id: req.body.id,
            committedByUserId: res.locals.userId,
            content: req.body.content,
            votesSum: null,
            votesSumDelta: req.body.votesSumDelta
        };
        const {err, response} = await this.questionsService.editAnswerComment(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`PATCH /questions/answers/comments/ request ended for ${requestData.id}`)
        return res.status(200).send(response);
    }

    deleteAnswerComments = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            ids: Array.isArray(req.body.ids) ? req.body.ids : null,
            committedByUserId: res.locals.userId
        };
        const {err, response} = await this.questionsService.deleteAnswerComments(requestData);
        if(err != null)
            return next(err);
        this.logger.info(`DELETE /questions/answers/comments/ request ended for ${requestData.ids.join()}`)
        return res.status(200).send(response);
    }
}

export default new QuestionsController(questionsService, logger);
