"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StudyPlansService_1 = __importDefault(require("../services/StudyPlansService"));
class StudyPlansController {
    constructor(studyPlansService) {
        this.getStudyPlans = async (req, res, next) => {
            try {
                const { err, response } = await this.studyPlansService.getStudyPlans({ userId: res.locals.userId });
                if (err != null)
                    return next(err);
                return res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.addStudyPlan = async (req, res, next) => {
            try {
                const data = {
                    name: req.body.name,
                    activityIds: Array.isArray(req.body.activityIds) ? req.body.activityIds : []
                };
                const { err, response } = await this.studyPlansService.addStudyPlan(data);
                if (err != null)
                    return next(err);
                return res.status(201).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.editStudyPlan = async (req, res, next) => {
            try {
                const data = {
                    planId: req.body.id,
                    name: req.body.name,
                    activityIds: Array.isArray(req.body.activityIds) ? req.body.activityIds : []
                };
                const { err, response } = await this.studyPlansService.editStudyPlan(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteStudyPlans = async (req, res, next) => {
            try {
                const data = { planIds: Array.isArray(req.body.ids) ? req.body.ids : [] };
                const { err, response } = await this.studyPlansService.deleteStudyPlans(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.setUsers = async (req, res, next) => {
            try {
                const data = {
                    id: req.body.id,
                    userIds: Array.isArray(req.body.userIds) ? req.body.userIds.filter((value, index, self) => self.indexOf(value) === index) : null
                };
                const { err, response } = await this.studyPlansService.setUsers(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.studyPlansService = studyPlansService;
    }
}
exports.default = new StudyPlansController(StudyPlansService_1.default);
//# sourceMappingURL=StudyPlansController.js.map