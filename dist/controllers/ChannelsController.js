"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const DiscordApiService_1 = require("../services/DiscordApiService");
const Logger_1 = __importDefault(require("../helpers/Logger"));
const DiscordService_1 = __importDefault(require("../services/DiscordService"));
class ChannelsController {
    constructor(discordService) {
        this.moveMembers = async (req, res, next) => {
            const userIds = [req.body.userId];
            const usersTrackingData = [{ discordChannelId: req.body.channelId, userId: req.body.userId, status: Constants_1.Constants.DISCORD_MEMBER_ACTIVE_STATUS }];
            const { err: isUserValidError } = await this.discordService.areUsersValid(userIds);
            if (isUserValidError != null)
                return next(isUserValidError);
            const { err, response } = await ChannelsController.DiscordApiService.sendMoveMemberMsg({ usersTracking: usersTrackingData });
            if (err != null)
                return next(err);
            Logger_1.default.info(`(POST) /channels/member request ended.`);
            return res.status(200).send(response);
        };
        this.postChannel = async (req, res, next) => {
            const { err, response } = await ChannelsController.DiscordApiService.sendCreateChannelMsg({ channelName: req.body.channelName });
            if (err != null)
                return next(err);
            Logger_1.default.info(`(POST) /channels request ended.`);
            return res.status(200).send(response);
        };
        this.getChannels = async (req, res, next) => {
            const { err, response } = await this.discordService.getDiscordChannelsData();
            if (err != null)
                return next(err);
            Logger_1.default.info(`(GET) /channels request ended.`);
            return res.status(200).send(response);
        };
        this.discordService = discordService;
    }
}
ChannelsController.DiscordApiService = DiscordApiService_1.DiscordApiService;
exports.default = new ChannelsController(DiscordService_1.default);
//# sourceMappingURL=ChannelsController.js.map