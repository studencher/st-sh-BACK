import {CustomError, BotInstructions, Constants, ApiResponse, ServiceResponse, Validations, IClientRequestData, DiscordService} from "../studentcher-shared-utils";
import axios from "axios";

export class DiscordApiService {

    static async sendMessage(message : BotInstructions): Promise<ServiceResponse>{
        try{

            await axios.post(process.env.DISCORD_WEBHOOK_URL, {content: JSON.stringify(message)});
            return {response: new ApiResponse(true)}
        }catch (err){
            return {err}
        }
    }
    static async sendCreateChannelMsg(data: IClientRequestData) : Promise<ServiceResponse>{
        const {result, message} = Validations.areFieldsProvided(["channelName"], data);
        if(!result)
            return {err: new CustomError(message)};
        const {channelName} = data;
        const msg = new BotInstructions(Constants.CREATE_NEW_CHANNEL_MSG, { channelName })
        return this.sendMessage(msg);
    }


    static async sendCreateChannelMsgAlt(data: IClientRequestData) : Promise<ServiceResponse>{
      
        const  channelName  = data.channelName;
        const userId = data.userId
        const msg = new BotInstructions(Constants.CREATE_NEW_CHANNEL_MSG, { channelName,userId })
        return this.sendMessage(msg);
    }
    static async sendDisconnectUserFromChannel(data: any) : Promise<ServiceResponse>{
      
         const userId = data.userId
        const msg = new BotInstructions(Constants.DISCONNECT_MEMBER_MSG, { data})
        return this.sendMessage(msg);
    }


    static async sendMoveMemberMsg(data: IClientRequestData){
        const { usersTracking } = data;
        const {isMeetingEnded} =data
        
        const {result, message} = DiscordService.areUserTrackingInputsValid(usersTracking)
        if(!result)
            return {err: new CustomError(message)};
        const msg = new BotInstructions("$move", { usersTracking,isMeetingEnded })
        return this.sendMessage(msg);
    }

    static async sendGeneralMsg(data: IClientRequestData){
        const {result, message} = Validations.areFieldsProvided(["message"], data);
        if(!result)
            return {err: new CustomError(message)};
        const msg = new BotInstructions("$message", { message: data.message })
        return this.sendMessage(msg);
    }

}
