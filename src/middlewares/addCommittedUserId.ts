import {CustomError, Constants} from "../studentcher-shared-utils";
import {Request, Response} from "express";


export function addCommittedUserId(req: Request, res: Response, next: Function){
    if(res.locals.userId == null)
        return next(new CustomError("Request not passed authorization"));
    req.body.committedUserId = res.locals.userId;
    req.headers[Constants.PROXY_AUTHORIZED_HEADER] = res.locals.userId;
    return next()
}
