"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthenticationService_1 = __importDefault(require("../services/AuthenticationService"));
const PostgresAdapter_1 = require("../studentcher-shared-utils/storage/PostgresAdapter");
const UsersService_1 = __importDefault(require("../services/UsersService"));
const RegistrationService_1 = __importDefault(require("../services/RegistrationService"));
const router = express_1.default.Router();
router.post("/login", AuthenticationService_1.default.authenticate, PostgresAdapter_1.userActivityTracker, async function (req, res, next) {
    const { err, response } = await RegistrationService_1.default.loginHandler(res.locals.userId);
    if (err)
        return next(err);
    return res.status(200).send(response);
});
router.post("/logout", AuthenticationService_1.default.verify, PostgresAdapter_1.userActivityTracker, async function (req, res, _next) {
    return res.status(200).send();
});
router.patch("/me", AuthenticationService_1.default.authenticate, AuthenticationService_1.default.verify, PostgresAdapter_1.userActivityTracker, async (req, res, next) => {
    try {
        const data = {
            committedUserId: res.locals.userId,
            id: res.locals.userId,
            password: req.body.newPassword
        };
        const { err, response } = await UsersService_1.default.editUser(data);
        if (err != null)
            return next(err);
        res.status(200).send({ data: response });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=registrationRouter.js.map