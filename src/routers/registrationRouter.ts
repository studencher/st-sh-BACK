import express, {Request, Response} from "express";

import authenticationService from "../services/AuthenticationService";
import {userActivityTracker} from "../studentcher-shared-utils/storage/PostgresAdapter";
import usersService from "../services/UsersService";
import registrationService from "../services/RegistrationService";

const router = express.Router();

router.post("/login", authenticationService.authenticate, userActivityTracker, async function (req: Request, res: Response, next: Function){
    const { err, response } = await registrationService.loginHandler(res.locals.userId);
    if(err)
        return next(err);
    return res.status(200).send(response);
});

router.post("/logout", authenticationService.verify, userActivityTracker, async function (req: Request, res: Response, _next: Function){
    await registrationService.logoutHandler(res.locals.userId);
    console.log('logout router')
    return res.status(200).send();
});




router.patch("/me", authenticationService.authenticate, authenticationService.verify, userActivityTracker,
    async (req: Request, res: Response, next: Function) => {
        try {
            const data = {
                committedUserId: res.locals.userId,
                id: res.locals.userId,
                password: req.body.newPassword
            }
            const {err, response} = await usersService.editUser(data)
            if(err != null)
                return next(err)
            res.status(200).send({ data: response });
        } catch (err) {
            next(err)
        }
    });


export default router;
