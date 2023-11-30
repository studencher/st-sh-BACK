"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MeetingsService_1 = __importDefault(require("../services/MeetingsService"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
const DiscordService_1 = __importDefault(require("../services/DiscordService"));
class MeetingsController {
    constructor(meetingsService, discordService) {
        this.getUserMeetings = async (req, res, next) => {
            const { meetingId, userId, isNoteProvided, isRateProvided } = req.query;
            const requestData = {
                meetingIds: meetingId == null ? null :
                    Array.isArray(meetingId) ? meetingId : [meetingId],
                userIds: userId == null ? null :
                    Array.isArray(userId) ? userId : [userId],
                isNoteProvided: isNoteProvided == null ? null : isNoteProvided === "t",
                isRateProvided: isRateProvided == null ? null : isRateProvided === "t"
            };
            const { err, response } = await this.meetingsService.getUserMeetings(requestData);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.addMeeting = async (req, res, next) => {
            const requestData = {
                committedUserId: res.locals.userId,
                userIds: Array.isArray(req.body.userIds) ? req.body.userIds.concat(res.locals.userId) : [],
                channelId: req.body.channelId
            };
            const { err, response } = await this.meetingsService.addMeeting(requestData);
            if (err != null)
                return next(err);
            Logger_1.default.info(`/meetings/start request started for ${requestData.userIds.join()}`);
            return res.status(200).send({ data: response });
        };
        this.getUsersTracking = async (req, res, next) => {
            const { err, response } = await this.discordService.getUsersPreMeetingTracking(req.body.meetingId);
            if (err)
                return next(err);
            res.locals.usersTracking = response.data.usersTracking;
            next();
        };
        this.endMeeting = async (req, res, next) => {
            const requestData = { meetingId: req.body.meetingId, usersTracking: res.locals.usersTracking };
            const { err, response } = await this.meetingsService.endMeeting(requestData);
            if (err)
                return next(err);
            Logger_1.default.info(`/meetings/end request ended for ${requestData.meetingId}`);
            return res.status(200).send({ data: response });
        };
        this.editUserMeetings = async (req, res, next) => {
            const requestData = {
                userId: res.locals.userId,
                meetings: Array.isArray(req.body.meetings) ? req.body.meetings : [],
            };
            const { err, response } = await this.meetingsService.editUserMeetings(requestData);
            if (err != null)
                return next(err);
            return res.status(200).send(response);
        };
        this.supervisorEnteringMeeting = async (req, res, next) => {
            console.log(req.body);
            const requestData = {
                channel: req.body.channel.id,
                supervisorId: req.body.userData.user.id,
                role: req.body.userData.user.role,
                loggedUsers: req.body.channel.loggedUsers
            };
            const { err, response } = await this.meetingsService.supervisorEnteringMeeting(requestData);
        };
        this.meetingsService = meetingsService;
        this.discordService = discordService;
    }
}
exports.default = new MeetingsController(MeetingsService_1.default, DiscordService_1.default);
//# sourceMappingURL=MeetingsController.js.map