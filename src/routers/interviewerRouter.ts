import proxy from 'express-http-proxy';
import url from "url";
import express from "express";
import {Constants} from "../studentcher-shared-utils";
import {addCommittedUserId} from "../middlewares/addCommittedUserId";
import authorizationService from "../services/AuthorizationService";
import authenticationService from "../services/AuthenticationService";

const router = express.Router();

router.use("/", authenticationService.verify,
    authorizationService.verifyUserPermission(Constants.permissions.liveSubscription),
    addCommittedUserId,   proxy(process.env.INTERVIEWER_API_ADDRESS, {
        proxyReqPathResolver: function(req, _res) {
            return '/api' + url.parse(req.url).path;
        }}));

export default router;
