"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordApiService = void 0;
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const axios_1 = __importDefault(require("axios"));
class DiscordApiService {
    static async sendMessage(message) {
        try {
            await axios_1.default.post(process.env.DISCORD_WEBHOOK_URL, { content: JSON.stringify(message) });
            return { response: new studentcher_shared_utils_1.ApiResponse(true) };
        }
        catch (err) {
            return { err };
        }
    }
    static async sendCreateChannelMsg(data) {
        const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["channelName"], data);
        if (!result)
            return { err: new studentcher_shared_utils_1.CustomError(message) };
        const { channelName } = data;
        const msg = new studentcher_shared_utils_1.BotInstructions(studentcher_shared_utils_1.Constants.CREATE_NEW_CHANNEL_MSG, { channelName });
        return this.sendMessage(msg);
    }
    static async sendMoveMemberMsg(data) {
        const { usersTracking } = data;
        const { result, message } = studentcher_shared_utils_1.DiscordService.areUserTrackingInputsValid(usersTracking);
        if (!result)
            return { err: new studentcher_shared_utils_1.CustomError(message) };
        const msg = new studentcher_shared_utils_1.BotInstructions("$move", { usersTracking });
        return this.sendMessage(msg);
    }
    static async sendGeneralMsg(data) {
        const { result, message } = studentcher_shared_utils_1.Validations.areFieldsProvided(["message"], data);
        if (!result)
            return { err: new studentcher_shared_utils_1.CustomError(message) };
        const msg = new studentcher_shared_utils_1.BotInstructions("$message", { message: data.message });
        return this.sendMessage(msg);
    }
}
exports.DiscordApiService = DiscordApiService;
//# sourceMappingURL=DiscordApiService.js.map