"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Passport = require('passport');
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const postgresAdapter_1 = __importDefault(require("../storage/postgresAdapter"));
const bcrypt = require('bcrypt');
const studentcher_shared_utils_1 = require("../studentcher-shared-utils");
const secret = process.env.JWT_SECRET;
function fromHeaderWithScheme(header_name, auth_scheme) {
    return function (request) {
        var token = null;
        if (request.headers[header_name]) {
            token = request.headers[header_name];
            if (token && token.toString().startsWith(auth_scheme)) {
                token = token.slice(auth_scheme.length);
            }
            else {
                token = null;
            }
        }
        return token;
    };
}
const jwtOptions = {
    jwtFromRequest: fromHeaderWithScheme('x-authorization', 'JWT '),
    secretOrKey: secret
};
// Setting up local login strategy
const localAuth = new passport_local_1.Strategy({}, async function (username, password, done) {
    try {
        if (!username || !password) {
            return done(new studentcher_shared_utils_1.CustomError(studentcher_shared_utils_1.Constants.AUTHENTICATION_MISSING_PARAMS_MESSAGE));
        }
        const sqlQuery = "select id, password from users where id = $1";
        const response = await postgresAdapter_1.default.callDbCmd(sqlQuery, [username]);
        if (response.rowCount !== 1) {
            return done(null, false, { message: studentcher_shared_utils_1.Constants.AUTHENTICATION_FAILED_MESSAGE });
        }
        const user = response.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return done(null, false, { message: studentcher_shared_utils_1.Constants.AUTHENTICATION_FAILED_MESSAGE });
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
});
const jwtAuth = new passport_jwt_1.Strategy(jwtOptions, function (jwt_payload, done) {
    return done(null, jwt_payload.userId, jwt_payload);
});
Passport.use(jwtAuth);
Passport.use(localAuth);
exports.default = Passport;
//# sourceMappingURL=passportHelper.js.map