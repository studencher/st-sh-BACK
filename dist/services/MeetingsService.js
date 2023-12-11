"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingsService = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const uuid = __importStar(require("uuid"));
const DiscordApiService_1 = require("./DiscordApiService");
const MeetingsRepository_1 = __importDefault(require("../repositories/MeetingsRepository"));
const DiscordService_1 = __importDefault(require("./DiscordService"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
class MeetingsService {
    constructor(discordService, meetingsRepository, logger) {
        this.discordService = discordService;
        this.meetingsRepository = meetingsRepository;
        this.logger = logger;
    }
    async getUserMeetings(data) {
        try {
            const userMeetings = await this.meetingsRepository.findUserMeetings(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { userMeetings }) };
        }
        catch (err) {
            return { err };
        }
    }
    async editUserMeetings(data) {
        try {
            const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["userId", "meetings"], data);
            if (!result)
                return { err: new studentcher_shared_utils_1.CustomError(message) };
            if (data.meetings.length === 0)
                return { err: new studentcher_shared_utils_1.CustomError("Meetings list cannot be an empty list.") };
            data.meetings.forEach((meeting) => {
                if (meeting == null)
                    return { err: new studentcher_shared_utils_1.CustomError("Each meeting must be object with at least id.") };
                if (meeting.id == null)
                    return { err: new studentcher_shared_utils_1.CustomError("Each meeting must contain id.") };
                meeting.rate = meeting.rate == null ? null : parseInt(meeting.rate);
                if (meeting.rate != null && (isNaN(meeting.rate) || meeting.rate > 5 || meeting.rate < 0))
                    return { err: new studentcher_shared_utils_1.CustomError(`Invalid value for rate: ${meeting.rate}`) };
            });
            const userMeeting = await this.meetingsRepository.editUserMeetings(data);
            if (userMeeting == null)
                return { err: new studentcher_shared_utils_1.CustomError("User's meeting not found", 404) };
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { userMeeting }) };
        }
        catch (err) {
            return { err };
        }
    }
    async addMeeting(data) {
        try {
            const { err: isUserValidError } = await this.discordService.areUsersValid(data.userIds);
            if (isUserValidError != null)
                return { err: isUserValidError };
            const meetingId = MeetingsService.idGenerator();
            const usersTrackingBusy = data.userIds.map((userId) => {
                return {
                    discordChannelId: data.channelId,
                    status: studentcher_shared_utils_1.Constants.DISCORD_MEMBER_BUSY_STATUS,
                    userId,
                    meetingId
                };
            });
            /*  [
            {
               discordChannelId: "1159445172518662184",
               meetingId: "3a6eb880-8d32-11ee-90cf-87388948d11f",
               status: "busy",
               userId: "whiteWhale@hyperactive.co.il"
             },
             {
               discordChannelId: "1159445172518662184",
               meetingId: "3a6eb880-8d32-11ee-90cf-87388948d11f",
               status: "busy",
               userId: "dimitriy@hyperactive.co.il"
             }
           ]*/
            const sendMoveMemberMsgData = { usersTracking: usersTrackingBusy };
            this.logger.info(JSON.stringify(sendMoveMemberMsgData));
            const { err: discordApiError } = await DiscordApiService_1.DiscordApiService.sendMoveMemberMsg(sendMoveMemberMsgData);
            if (discordApiError)
                return { err: discordApiError };
            data.id = meetingId;
            const meeting = await this.meetingsRepository.insertOne(data);
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { meeting }) };
        }
        catch (err) {
            return { err };
        }
    }
    async endMeeting(data) {
        try {
            const sendMoveMemberMsgData = { usersTracking: data.usersTracking };
            this.logger.info(JSON.stringify(sendMoveMemberMsgData));
            const { err: discordApiError } = await DiscordApiService_1.DiscordApiService.sendMoveMemberMsg(sendMoveMemberMsgData);
            if (discordApiError)
                return { err: discordApiError };
            const meeting = await this.meetingsRepository.editOne({ id: data.meetingId, endedAt: new Date().toISOString() });
            return { response: new studentcher_shared_utils_1.ApiResponse(true, { meeting }) };
        }
        catch (err) {
            return { err };
        }
    }
    async supervisorEnteringMeeting(requestData) {
        console.log(requestData);
        let meeting_id = await this.meetingsRepository.findMeetingIdForSupervisorEntering(requestData); // obtaining the meeting id that 2 users are currently on
        meeting_id = meeting_id.rows[0].meeting_id;
        console.log(meeting_id);
        let sendMoveMemberMsgData = {
            discordChannelId: requestData.channel,
            meetingId: meeting_id,
            status: "busy",
            userId: requestData.supervisorId
        };
        let data = { usersTracking: [sendMoveMemberMsgData] };
        await DiscordApiService_1.DiscordApiService.sendMoveMemberMsg(data);
    }
    async sendChannelCreationMessagetoChat(channelName, userId, roleId) {
        const { err: discordApiError } = await DiscordApiService_1.DiscordApiService.sendCreateChannelMsgAlt({ channelName, userId });
        if (discordApiError)
            return { err: discordApiError };
    }
    async disconnectUserFromDiscord(data) {
        const { err: discordApiError } = await DiscordApiService_1.DiscordApiService.sendDisconnectUserFromChannel(data);
        if (discordApiError)
            return { err: discordApiError };
    }
}
exports.MeetingsService = MeetingsService;
MeetingsService.idGenerator = uuid.v1;
exports.default = new MeetingsService(DiscordService_1.default, MeetingsRepository_1.default, Logger_1.default);
//# sourceMappingURL=MeetingsService.js.map