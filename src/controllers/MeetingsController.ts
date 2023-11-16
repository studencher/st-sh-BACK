import { NextFunction, Request, Response } from 'express';
import meetingsService, {IMeetingsService} from "../services/MeetingsService";
import logger from "../helpers/Logger";
import discordService from "../services/DiscordService";
import {IDiscordService} from "../studentcher-shared-utils/services/DiscordService";

class MeetingsController {
    meetingsService: IMeetingsService
    discordService: IDiscordService
    constructor(meetingsService: IMeetingsService, discordService: IDiscordService) {
        this.meetingsService = meetingsService;
        this.discordService = discordService;
    }
    getUserMeetings = async (req :Request,res :Response, next: NextFunction)=>{

        const {meetingId, userId, isNoteProvided, isRateProvided} = req.query;
        const requestData = {
            meetingIds: meetingId == null? null :
                Array.isArray(meetingId) ? meetingId : [meetingId],
            userIds: userId == null? null :
                Array.isArray(userId) ? userId : [userId],
            isNoteProvided: isNoteProvided == null ? null : isNoteProvided === "t",
            isRateProvided  : isRateProvided == null ? null : isRateProvided === "t"
        }
        const {err, response} = await this.meetingsService.getUserMeetings(requestData);
        if(err != null)
            return next(err);
        return res.status(200).send(response);
    }

    addMeeting = async(req :Request, res :Response, next: NextFunction)=>{
        const requestData = {
            committedUserId: res.locals.userId,
            userIds: Array.isArray(req.body.userIds) ? req.body.userIds.concat(res.locals.userId) : [],
            channelId: req.body.channelId
        }
        const {err, response} = await this.meetingsService.addMeeting(requestData);
        if(err != null)
            return next(err)
        logger.info(`/meetings/start request started for ${requestData.userIds.join()}`)
        return res.status(200).send({ data: response });
    }

    getUsersTracking = async (req, res, next) => {
        const { err, response } = await this.discordService.getUsersPreMeetingTracking(req.body.meetingId);
        if(err)
            return next(err);
        res.locals.usersTracking = response.data.usersTracking;
        next();
    }

    endMeeting = async(req :Request, res :Response, next: NextFunction)=>{
        const requestData = {meetingId: req.body.meetingId, usersTracking: res.locals.usersTracking};
        const {err, response} = await this.meetingsService.endMeeting(requestData);
        if(err)
            return next(err);
        logger.info(`/meetings/end request ended for ${requestData.meetingId}`);
        return res.status(200).send({ data: response });
    }

    editUserMeetings = async (req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            userId: res.locals.userId,
            meetings: Array.isArray(req.body.meetings) ? req.body.meetings : [],
        };
        const {err, response} = await this.meetingsService.editUserMeetings(requestData);
        if(err != null)
            return next(err);
        return res.status(200).send(response);
    }


}

export default new MeetingsController(meetingsService, discordService);
