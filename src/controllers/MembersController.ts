import { NextFunction, Request, Response } from 'express';
import {IDiscordService} from "../studentcher-shared-utils/services/DiscordService";
import redisAdapter from "../helpers/RedisAdapter";
import {Constants} from "../studentcher-shared-utils/helpers/Constants";
import {RedisAdapter} from "../studentcher-shared-utils/storage/RedisAdapter";
import discordService from "../services/DiscordService";

class MembersController {
    discordService: IDiscordService;
    redisAdapter: RedisAdapter;
    constructor(discordService, redisAdapter) {
        this.discordService = discordService;
        this.redisAdapter = redisAdapter;
    }
    postMemberStatus = async(req :Request,res :Response, next: NextFunction)=>{
        const requestData = {
            discordChannelId: req.body.channelId,
            userId:req.body.userId,
            status: typeof req.body.status === "string" ? req.body.status : null
        }
        const {err, response} = await this.discordService.addUsersTracking({usersTracking: [requestData]});
        if(err != null)
            return next(err);
        res.status(200).send({ data: response });
        for (const userTrack of response.data.usersTracking) {
            const message = JSON.stringify({userTrack});
            await this.redisAdapter.publish(Constants.STUDY_CHANNELS_SUBSCRIPTION, message);
        }
    }

    getMemberLastTrack = async (req: Request, res: Response, next: NextFunction)=>{
        const {err, response} = await this.discordService.getUserLastDiscordTrack();
        if(err != null)
            return next(err);
        return res.status(200).send({ data: response });
    }

}

export default new MembersController(discordService, redisAdapter)
