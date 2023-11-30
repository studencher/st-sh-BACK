import { NextFunction, Request, Response } from 'express';
import {IActivitiesService} from "../studentcher-shared-utils/services/ActivitiesService";
import activitiesService from "../services/ActivitiesService";
import {CloudService} from "../studentcher-shared-utils/services/CloudService";
import cloudService from "../services/CloudService";

class ActivitiesController {
    activitiesService: IActivitiesService
    cloudService: CloudService
    constructor(activitiesService, cloudService) {
        this.activitiesService = activitiesService;
        this.cloudService = cloudService;
    }
    getActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {err, response} = await this.activitiesService.getActivities({userId: res.locals.userId})
            if(err != null)
                return next(err)
            const optionalVideos =  await this.cloudService.getActivitiesVideosOnCloud();
            const combinedResponse = {...response, optionalVideos}
            res.status(200).send(combinedResponse);
        } catch (err) {
            next(err)
        }
    }

    addActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
              ownerId: req.body.ownerId,
              name: req.body.name,
              fileName: req.body.name,
              maxThresholdInDays: req.body.maxThresholdInDays,
              responsibleRoleId: req.body.responsibleRoleId,
              videos: Array.isArray(req.body.videos) ? req.body.videos : [],
            };
            const {err, response} = await this.activitiesService.addActivity(data);
            if(err != null)
                return next(err)
            return res.status(201).send({ data: response });
        } catch (err) {
            next(err)
        }
    }

    editActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                activityId: req.body.id,
                ownerId: req.body.ownerId,
                name: req.body.name,
                srcUrl: req.body.srcUrl,
                maxThresholdInDays: req.body.maxThresholdInDays,
                responsibleRoleId: req.body.responsibleRoleId,
                videos: Array.isArray(req.body.videos) ? req.body.videos : []
            }
            const {err, response} = await this.activitiesService.editActivity(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }

    deleteActivities  = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = { activityIds: Array.isArray(req.body.ids) ? req.body.ids : [] }
            const {err, response} = await this.activitiesService.deleteActivities(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }
    postVideoMetaData =async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                userId: res.locals.userId,
                planId: req.body.planId,
                activityId: req.body.activityId,
                videoIndex: req.body.videoIndex,
                metaData: req.body.metaData
            }
            const {err, response} = await this.activitiesService.addActivityMetaData(data);
            if(err != null)
                return next(err)
            return res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    }

}

export default new ActivitiesController(activitiesService, cloudService)
