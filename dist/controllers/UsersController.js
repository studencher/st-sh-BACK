"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UsersService_1 = __importDefault(require("../services/UsersService"));
const DiscordService_1 = __importDefault(require("../services/DiscordService"));
class UsersController {
    constructor(usersService) {
        this.getUsers = async (req, res, next) => {
            try {
                const { err, response } = await this.usersService.getUsers({ userId: res.locals.userId });
                if (err != null) {
                    return next(err);
                }
                res.status(200).send(response);
            }
            catch (err) {
                next(err);
            }
        };
        this.addUser = async (req, res, next) => {
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
            }
            catch (err) {
                next(err);
            }
        };
        this.editUser = async (req, res, next) => {
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
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteUsers = async (req, res, next) => {
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
            }
            catch (err) {
                next(err);
            }
        };
        this.addUserActivity = async (req, res, next) => {
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
            }
            catch (err) {
                next(err);
            }
        };
        this.getUsersCloudUsage = async (req, res, next) => {
            const { response, err } = await this.usersService.getUsersCloudUsage();
            if (err) {
                return next(err);
            }
            return res.status(200).send(response);
        };
        this.getUserPersonalZone = async (req, res, next) => {
            const { err, response } = await this.usersService.getPersonalZone({ userId: res.locals.userId });
            if (err != null)
                return next(err);
            res.status(200).send(response);
        };
        this.postUserActivityVideoStatus = async (req, res, next) => {
            const requestData = {
                userId: res.locals.userId,
                planId: req.body.planId,
                activityId: req.body.activityId,
                videoIndex: req.body.videoIndex,
                isCompleted: req.body.isCompleted
            };
            const { err, response } = await this.usersService.addUserActivityVideoStatus(requestData);
            if (err != null)
                return next(err);
            res.status(200).send(response);
        };
        this.getUserLastDiscordTrack = async (req, res, next) => {
            const { err, response } = await DiscordService_1.default.getUserLastDiscordTrack();
            if (err != null)
                return next(err);
            res.status(200).send(response);
        };
        this.usersService = usersService;
    }
}
exports.default = new UsersController(UsersService_1.default);
//# sourceMappingURL=UsersController.js.map