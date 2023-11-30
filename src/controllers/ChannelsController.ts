import { NextFunction, Request, Response } from 'express';
import {IDiscordService} from "../studentcher-shared-utils/services/DiscordService";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";
import {DiscordApiService} from "../services/DiscordApiService";
import logger from "../helpers/Logger";
import discordService from "../services/DiscordService";

class ChannelsController {
    static DiscordApiService = DiscordApiService;
    discordService: IDiscordService
    constructor(discordService) {
        this.discordService = discordService
    }
    moveMembers = async(req :Request,res :Response, next: NextFunction)=>{
        const userIds = [req.body.userId]
        const usersTrackingData = [{discordChannelId: req.body.channelId, userId: req.body.userId, status: Constants.DISCORD_MEMBER_ACTIVE_STATUS}];
        const {err: isUserValidError} = await this.discordService.areUsersValid(userIds);
        if(isUserValidError != null)
            return next(isUserValidError);
        const {err, response} = await ChannelsController.DiscordApiService.sendMoveMemberMsg({usersTracking: usersTrackingData});
        if(err != null)
            return next(err);
        logger.info(`(POST) /channels/member request ended.`);
        return res.status(200).send(response);
    }

    postChannel = async(req :Request,res :Response, next: NextFunction)=>{
        const {err, response} = await ChannelsController.DiscordApiService.sendCreateChannelMsg( {channelName: req.body.channelName});
        if(err != null)
            return next(err);
        logger.info(`(POST) /channels request ended.`);
        return res.status(200).send(response);
    }

    getChannels = async(req :Request,res :Response, next: NextFunction)=>{
        const {err, response} = await this.discordService.getDiscordChannelsData();
        if(err != null)
            return next(err);
        logger.info(`(GET) /channels request ended.`);
        return res.status(200).send(response);
    }


}

export default new ChannelsController(discordService);
