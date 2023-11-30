"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActivitiesService_1 = __importDefault(require("../services/ActivitiesService"));
const CloudService_1 = __importDefault(require("../services/CloudService"));
class ActivitiesController {
    constructor(activitiesService, cloudService) {
        this.getActivities = async (req, res, next) => {
            try {
                const { err, response } = await this.activitiesService.getActivities({ userId: res.locals.userId });
                if (err != null)
                    return next(err);
                const optionalVideos = await this.cloudService.getActivitiesVideosOnCloud();
                const combinedResponse = Object.assign(Object.assign({}, response), { optionalVideos });
                res.status(200).send(combinedResponse);
            }
            catch (err) {
                next(err);
            }
        };
        this.addActivity = async (req, res, next) => {
            try {
                const data = {
                    ownerId: req.body.ownerId,
                    name: req.body.name,
                    fileName: req.body.fileName,
                    maxThresholdInDays: req.body.maxThresholdInDays,
                    responsibleRoleId: req.body.responsibleRoleId,
                    videos: Array.isArray(req.body.videos) ? req.body.videos : []
                };
                const { err, response } = await this.activitiesService.addActivity(data);
                if (err != null)
                    return next(err);
                return res.status(201).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.editActivity = async (req, res, next) => {
            try {
                const data = {
                    activityId: req.body.id,
                    ownerId: req.body.ownerId,
                    name: req.body.name,
                    srcUrl: req.body.srcUrl,
                    maxThresholdInDays: req.body.maxThresholdInDays,
                    responsibleRoleId: req.body.responsibleRoleId,
                    videos: Array.isArray(req.body.videos) ? req.body.videos : []
                };
                const { err, response } = await this.activitiesService.editActivity(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteActivities = async (req, res, next) => {
            try {
                const data = { activityIds: Array.isArray(req.body.ids) ? req.body.ids : [] };
                const { err, response } = await this.activitiesService.deleteActivities(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.postVideoMetaData = async (req, res, next) => {
            try {
                const data = {
                    userId: res.locals.userId,
                    planId: req.body.planId,
                    activityId: req.body.activityId,
                    videoIndex: req.body.videoIndex,
                    metaData: req.body.metaData
                };
                const { err, response } = await this.activitiesService.addActivityMetaData(data);
                if (err != null)
                    return next(err);
                return res.status(200).send({ data: response });
            }
            catch (err) {
                next(err);
            }
        };
        this.activitiesService = activitiesService;
        this.cloudService = cloudService;
    }
}
exports.default = new ActivitiesController(ActivitiesService_1.default, CloudService_1.default);
//# sourceMappingURL=ActivitiesController.js.map