"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discordBotHealthCheck = void 0;
const axios_1 = __importDefault(require("axios"));
async function discordBotHealthCheck(req, res, next) {
    try {
        await axios_1.default.get(process.env.DISCORD_BOT_ADDRESS);
        next();
    }
    catch (err) {
        const error = new Error(`discordBotHealthCheck returned with: ${err.message}, from: ${process.env.DISCORD_BOT_ADDRESS}`);
        next(error);
    }
}
exports.discordBotHealthCheck = discordBotHealthCheck;
//# sourceMappingURL=discordBotHealthCheck.js.map