import {
    IClientRequestData,
    ServiceResponse,
    ApiResponse,
    Constants, CustomError, Validations, Logger
} from "../studentcher-shared-utils";
import * as uuid from "uuid";
import {DiscordApiService} from "./DiscordApiService";
import meetingsRepository, {MeetingsRepository} from "../repositories/MeetingsRepository";
import discordService from "./DiscordService";
import logger from "../helpers/Logger";
import {IMeeting, IUserMeeting} from "../studentcher-shared-utils/entities/meeting";
import {IDiscordService} from "../studentcher-shared-utils/services/DiscordService";

export interface IMeetingsService {
    getUserMeetings(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{ userMeetings: IUserMeeting[] }>>>;
    editUserMeetings(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{userMeeting: IUserMeeting}>>>;
    addMeeting(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{meeting: IMeeting}>>>;
    endMeeting(data: IClientRequestData): Promise<ServiceResponse<ApiResponse<{meeting: IMeeting}>>>;
    supervisorEnteringMeeting : any

}

export class MeetingsService implements IMeetingsService{
    static idGenerator = uuid.v1;

    private discordService: IDiscordService;
    private meetingsRepository: MeetingsRepository;
    private logger: Logger;
    constructor(discordService, meetingsRepository, logger) {
        this.discordService = discordService;
        this.meetingsRepository = meetingsRepository;
        this.logger = logger;
    }

    async getUserMeetings(data: IClientRequestData) : Promise<ServiceResponse>{
        try{
            const userMeetings = await this.meetingsRepository.findUserMeetings(data);
            return {response: new ApiResponse(true, {userMeetings})};
        }catch (err){
            return {err}
        }
    }

    async editUserMeetings(data: IClientRequestData): Promise<ServiceResponse>{
        try{
            const {result, message} = Validations.areFieldsProvided(["userId", "meetings"], data);
            if(!result)
                return {err: new CustomError(message)};
            if(data.meetings.length === 0)
                return {err: new CustomError("Meetings list cannot be an empty list.")}

            data.meetings.forEach((meeting)=>{
                if(meeting == null)
                    return {err: new CustomError("Each meeting must be object with at least id.")}
                if(meeting.id == null)
                    return {err: new CustomError("Each meeting must contain id.")}
                meeting.rate = meeting.rate == null ? null : parseInt(meeting.rate);
                if(meeting.rate != null && (isNaN(meeting.rate) || meeting.rate > 5 || meeting.rate < 0))
                    return {err: new CustomError(`Invalid value for rate: ${meeting.rate}`)}
            })

            const userMeeting = await this.meetingsRepository.editUserMeetings(data);
            if(userMeeting == null)
                return {err: new CustomError("User's meeting not found", 404)};
            return {response: new ApiResponse(true, {userMeeting})};
        }catch (err){
            return {err}
        }
    }
    async addMeeting (data: IClientRequestData) :Promise<ServiceResponse> {
        try{
            const {err: isUserValidError} = await this.discordService.areUsersValid(data.userIds);
            if(isUserValidError != null)
                return {err: isUserValidError};
            const meetingId = MeetingsService.idGenerator();
            const usersTrackingBusy = data.userIds.map((userId)=> {
                return {
                    discordChannelId: data.channelId,
                    status: Constants.DISCORD_MEMBER_BUSY_STATUS,
                    userId,
                    meetingId
                }
            })

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

            const sendMoveMemberMsgData = {usersTracking: usersTrackingBusy};
            this.logger.info(JSON.stringify(sendMoveMemberMsgData));
            const {err: discordApiError} = await DiscordApiService.sendMoveMemberMsg(sendMoveMemberMsgData);
            if(discordApiError)
                return {err: discordApiError};
            data.id = meetingId;
            const meeting = await this.meetingsRepository.insertOne(data);
            return { response: new ApiResponse(true, {meeting}) }
        }catch(err){
            return {err}
        }
    }

    async endMeeting(data: IClientRequestData) :Promise<ServiceResponse> {
        try {
            const sendMoveMemberMsgData = {usersTracking: data.usersTracking};
            this.logger.info(JSON.stringify(sendMoveMemberMsgData));
            const {err: discordApiError} = await DiscordApiService.sendMoveMemberMsg(sendMoveMemberMsgData);
            if(discordApiError)
                return {err: discordApiError};
            const meeting = await this.meetingsRepository.editOne({id: data.meetingId, endedAt: new Date().toISOString() });
            return { response: new ApiResponse(true, {meeting}) }
        }catch (err){
            return {err}
        }
    }

    async supervisorEnteringMeeting(requestData){
        console.log(requestData)
        let meeting_id = await this.meetingsRepository.findMeetingIdForSupervisorEntering(requestData) // obtaining the meeting id that 2 users are currently on
         meeting_id = meeting_id.rows[0].meeting_id
        console.log(meeting_id)

        let sendMoveMemberMsgData = {
            discordChannelId: requestData.channel,
            meetingId: meeting_id,
            status: "busy",
            userId:  requestData.supervisorId 
        }
        let data =  {usersTracking : [sendMoveMemberMsgData]}
          await DiscordApiService.sendMoveMemberMsg(data);
}

}


export default new MeetingsService(discordService, meetingsRepository, logger);
