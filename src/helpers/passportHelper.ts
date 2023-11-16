const Passport = require('passport');
import {Strategy as JwtStrategy} from 'passport-jwt';
import {Strategy as LocalStrategy} from 'passport-local';
import pgClient from '../storage/postgresAdapter';
const bcrypt = require('bcrypt');
import {CustomError, Constants} from "../studentcher-shared-utils";


const secret = process.env.JWT_SECRET;


function fromHeaderWithScheme(header_name: any, auth_scheme: any) {
    return function (request: any) {
        var token = null;
        if (request.headers[header_name]) {
            token = request.headers[header_name];
            if (token && token.toString().startsWith(auth_scheme)) {
                token = token.slice(auth_scheme.length);
            } else {
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
const localAuth = new LocalStrategy({}, async function(username: string, password: string, done: Function) {
    try {
        if (!username || !password) {
            return done(new CustomError(Constants.AUTHENTICATION_MISSING_PARAMS_MESSAGE));
        }
        const sqlQuery = "select id, password from users where id = $1";
        const response = await pgClient.callDbCmd(sqlQuery, [username]);
        if (response.rowCount !== 1) {
            return done(null, false,  {message: Constants.AUTHENTICATION_FAILED_MESSAGE});
        }
        const user = response.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return done(null, false, {message: Constants.AUTHENTICATION_FAILED_MESSAGE})
        return done(null, user);
    }catch (err){
        return done(err);
    }

});
const jwtAuth = new JwtStrategy(jwtOptions, function(jwt_payload: any, done: Function) {
    return done(null, jwt_payload.userId, jwt_payload);
});

Passport.use(jwtAuth);
Passport.use(localAuth);

export default Passport;
