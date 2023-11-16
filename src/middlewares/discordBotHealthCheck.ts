import {Request, Response} from "express";
import axios from "axios";

export async function discordBotHealthCheck (req: Request, res: Response, next: Function){
    try{
        await axios.get(process.env.DISCORD_BOT_ADDRESS);
        next();
    }catch (err){
        const error = new Error(`discordBotHealthCheck returned with: ${err.message}, from: ${process.env.DISCORD_BOT_ADDRESS}`);
        next(error)
    }
}


