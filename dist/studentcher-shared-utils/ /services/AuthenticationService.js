"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Constants_1 = require("../helpers/Constants");
const CustomError_1 = require("../models/CustomError");
class AuthenticationService {
    constructor(dbClient, logger, secret) {
        this.extractDecodedFromToken = (token) => {
            return jsonwebtoken_1.default.verify(token, this.secret);
        };
        this.verify = async (req, res, next) => {
            try {
                const token = req.header("x-authorization").replace("JWT ", "");
                const decoded = this.extractDecodedFromToken(token);
                res.locals.userId = decoded.userId;
                next();
            }
            catch (err) {
                this.logger.error(err.message);
                next(new CustomError_1.CustomError(Constants_1.Constants.AUTHENTICATION_FAILED_MESSAGE));
            }
        };
        this.authenticate = async (req, res, next) => {
            const username = req.body.username;
            const password = req.body.password;
            try {
                if (!username || !password) {
                    return next(new CustomError_1.CustomError(Constants_1.Constants.AUTHENTICATION_MISSING_PARAMS_MESSAGE));
                }
                const user = await this.getUserHashedPassword(username);
                const validPassword = await bcrypt_1.default.compare(password, user.hashedPassword);
                if (!validPassword)
                    return next(Constants_1.Constants.AUTHENTICATION_FAILED_MESSAGE);
                res.locals.userId = user.id;
                next();
            }
            catch (err) {
                return next(err);
            }
        };
        this.getUserHashedPassword = async (username) => {
            const sqlQuery = 'select id, password as "hashedPassword" from users where id = $1';
            const response = await this.dbClient.callDbCmd(sqlQuery, [username]);
            if (response.rowCount !== 1) {
                throw new CustomError_1.CustomError(Constants_1.Constants.AUTHENTICATION_FAILED_MESSAGE);
            }
            return response.rows[0];
        };
        this.generateControlPanelToken = (userId) => {
            const sessionInfo = { userId };
            return 'JWT ' + jsonwebtoken_1.default.sign(sessionInfo, this.secret, {
                expiresIn: Constants_1.Constants.TOKEN_EXPIRES_IN_NUMBER_OF_SECONDS
            });
        };
        this.dbClient = dbClient;
        this.logger = logger;
        this.secret = secret;
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map