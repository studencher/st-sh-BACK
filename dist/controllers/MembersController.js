"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RedisAdapter_1 = __importDefault(require("../helpers/RedisAdapter"));
const Constants_1 = require("../studentcher-shared-utils/helpers/Constants");
const DiscordService_1 = __importDefault(require("../services/DiscordService"));
class MembersController {
    constructor(discordService, redisAdapter) {
        this.postMemberStatus = async (req, res, next) => {
            const requestData = {
                discordChannelId: req.body.channelId,
                userId: req.body.userId,
                status: typeof req.body.status === "string" ? req.body.status : null
            };
            const { err, response } = await this.discordService.addUsersTracking({ usersTracking: [requestData] });
            if (err != null)
                return next(err);
            res.status(200).send({ data: response });
            for (const userTrack of response.data.usersTracking) {
                const message = JSON.stringify({ userTrack });
                await this.redisAdapter.publish(Constants_1.Constants.STUDY_CHANNELS_SUBSCRIPTION, message);
            }
        };
        this.getMemberLastTrack = async (req, res, next) => {
            const { err, response } = await this.discordService.getUserLastDiscordTrack();
            if (err != null)
                return next(err);
            return res.status(200).send({ data: response });
        };
        this.discordService = discordService;
        this.redisAdapter = redisAdapter;
    }
}
exports.default = new MembersController(DiscordService_1.default, RedisAdapter_1.default);
//# sourceMappingURL=MembersController.js.map