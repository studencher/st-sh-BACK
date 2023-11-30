"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
const Logger_1 = __importDefault(require("../helpers/Logger"));
class AuthenticationService {
    constructor(dbClient, logger, secret) {
        this.verify = async (req, res, next) => {
            try {
                const token = req.header("x-authorization").replace("JWT ", "");
                const decoded = jsonwebtoken_1.default.verify(token, this.secret);
                res.locals.userId = decoded.userId;
                next();
            }
            catch (err) {
                this.logger.error(err.message);
                next(new studentcher_shared_utils_1.CustomError(studentcher_shared_utils_1.Constants.AUTHENTICATION_FAILED_MESSAGE));
            }
        };
        this.authenticate = async (req, res, next) => {
            const username = req.body.username;
            const password = req.body.password;
            try {
                if (!username || !password) {
                    return next(new studentcher_shared_utils_1.CustomError(studentcher_shared_utils_1.Constants.AUTHENTICATION_MISSING_PARAMS_MESSAGE));
                }
                const user = await this.getUserHashedPassword(username);
                const validPassword = await bcrypt_1.default.compare(password, user.hashedPassword);
                if (!validPassword)
                    return next(studentcher_shared_utils_1.Constants.AUTHENTICATION_FAILED_MESSAGE);
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
                throw new studentcher_shared_utils_1.CustomError(studentcher_shared_utils_1.Constants.AUTHENTICATION_FAILED_MESSAGE);
            }
            return response.rows[0];
        };
        this.generateControlPanelToken = (userId) => {
            const sessionInfo = { userId };
            return 'JWT ' + jsonwebtoken_1.default.sign(sessionInfo, this.secret, {
                expiresIn: studentcher_shared_utils_1.Constants.TOKEN_EXPIRES_IN_NUMBER_OF_SECONDS
            });
        };
        this.dbClient = dbClient;
        this.logger = logger;
        this.secret = secret;
    }
}
exports.AuthenticationService = AuthenticationService;
exports.default = new AuthenticationService(postgresAdapter_1.default, Logger_1.default, process.env.JWT_SECRET);
//# sourceMappingURL=AuthenticationService.js.map