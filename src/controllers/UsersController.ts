import { NextFunction, Request, Response } from 'express';
import {IUsersService} from "../studentcher-shared-utils/services/UsersService";
import usersService from "../services/UsersService";

class UsersController {
    usersService: IUsersService
    constructor(usersService) {
        this.usersService = usersService
    }
    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { err, response } = await this.usersService.getUsers({ userId: res.locals.userId });
            if (err != null) {
                return next(err);
            }
            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    }

    addUser = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                committedUserId: res.locals.userId,
                id: req.body.id,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                roleId: req.body.roleId,
                discordUserId: req.body.discordUserId,
                password: process.env.DEFAULT_TEMP_PASSWORD,
            };
            const { err, response } = await this.usersService.addUser(data);
            if (err != null) {
                return next(err);
            }
            return res.status(201).send({ data: response });
        } catch (err) {
            next(err);
        }
    }

    editUser = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                committedUserId: res.locals.userId,
                id: req.body.id,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                roleId: req.body.roleId,
                password: req.body.password,
            };
            const { err, response } = await this.usersService.editUser(data);
            if (err != null) {
                return next(err);
            }
            res.status(200).send({ data: response });
        } catch (err) {
            next(err);
        }
    }

    deleteUsers = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                id: res.locals.userId,
                userIds: Array.isArray(req.body.ids) ? req.body.ids : [],
            };
            const { err, response } = await this.usersService.deleteUsers(data);
            if (err != null) {
                return next(err);
            }
            res.status(200).send({ data: response });
        } catch (err) {
            next(err);
        }
    }

    addUserActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = {
                userId: req.body.userId,
                planId: req.body.planId,
                activityId: req.body.activityId,
                isEnded: req.body.isEnded === true,
            };
            const { err, response } = await this.usersService.addUserActivity(data);
            if (err != null) {
                return next(err);
            }
            return res.status(201).send({ data: response });
        } catch (err) {
            next(err);
        }
    }

    getUsersCloudUsage = async(req: Request, res: Response, next: NextFunction) => {
        const { response, err } = await this.usersService.getUsersCloudUsage();
        if (err) {
            return next(err);
        }
        return res.status(200).send(response);
    }

    getUserPersonalZone = async(req: Request, res: Response, next: NextFunction) => {
        const {err, response} = await this.usersService.getPersonalZone({userId: res.locals.userId})
        if(err != null)
            return next(err)
        res.status(200).send(response);
    }

    postUserActivityVideoStatus = async (req: Request, res: Response, next: NextFunction) => {
        const requestData = {
            userId: res.locals.userId,
            planId: req.body.planId,
            activityId: req.body.activityId,
            videoIndex: req.body.videoIndex,
            isCompleted: req.body.isCompleted
        }
        const {err, response} = await this.usersService.addUserActivityVideoStatus(requestData)
        if(err != null)
            return next(err)
        res.status(200).send(response);
    }
}

export default new UsersController(usersService);
