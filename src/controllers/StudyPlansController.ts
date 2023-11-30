import studyPlansService, {IStudyPlansService} from "../services/StudyPlansService";
import {NextFunction, Request, Response} from "express";

class StudyPlansController {
    studyPlansService: IStudyPlansService
    constructor(studyPlansService) {
        this.studyPlansService = studyPlansService
    }

    getStudyPlans = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const {err, response} = await this.studyPlansService.getStudyPlans({userId: res.locals.userId});
            if(err != null)
                return next(err)
            return res.status(200).send(response);
        } catch (err) {
            next(err)
        }
    }

    addStudyPlan = async (req: Request, res: Response, next: Function) => {
        try {
            const data = {
                name: req.body.name,
                activityIds: Array.isArray(req.body.activityIds) ? req.body.activityIds : []
            }
            const {err, response} = await this.studyPlansService.addStudyPlan(data);
            if(err != null)
                return next(err)
            return res.status(201).send({ data: response });
        } catch (err) {
            next(err)
        }
    }

    editStudyPlan = async (req: Request, res: Response, next: Function) => {
        try {
            const data = {
              planId: req.body.id,
              name: req.body.name,
              activityIds: Array.isArray(req.body.activityIds)
                ? req.body.activityIds
                : [],
              users: Array.isArray(req.body.users)
                ? req.body.users
                : [],
            };
            const {err, response} = await this.studyPlansService.editStudyPlan(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }
    deleteStudyPlans = async (req: Request, res: Response, next: Function) => {
        try {
            const data = { planIds: Array.isArray(req.body.ids) ? req.body.ids : [] }
            const {err, response} = await this.studyPlansService.deleteStudyPlans(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }
    setUsers = async (req: Request, res: Response, next: Function) => {
        try {
            const data = {
                id: req.body.id,
                userIds: Array.isArray(req.body.userIds) ? req.body.userIds.filter((value, index, self)=> self.indexOf(value) === index) : null
            }
            const {err, response} = await this.studyPlansService.setUsers(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }
}

export default new StudyPlansController(studyPlansService);
